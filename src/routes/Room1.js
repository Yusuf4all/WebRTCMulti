import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./room.css";

var ICE_config = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
    {
      urls: "stun:stun1.l.google.com:19302",
    },
  ],
};

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2,
};

const Room = (props) => {
  const socketRef = useRef();
  const videoCtr = useRef();
  const remoteVideoCtr = useRef();
  const audioTrack = useRef();
  const videoTrack = useRef();
  const connection = useRef();
  const message = useRef();
  const remoteStream = useRef();
  const rtpSender = useRef();
  const [isStop, setCameraLabelStatus] = useState(true);
  const roomID = props.match.params.roomID;

  useEffect(() => {
    socketRef.current = io.connect("http://10.0.0.37:8000");
    // socketRef.current.emit("create_room",socket.id)
  }, []);

  useEffect(() => {
    const hitSocket = async () => {
      socketRef.current.on("join-user", async (data) => {
        message.current = JSON.parse(data);
        if (message.current.rejected) {
        } else if (message.current.answer) {
          await connection.current.setRemoteDescription(
            new RTCSessionDescription(message.current.answer)
          );
        } else if (message.current.offer) {
          debugger;
          let confirmation = true;

          if (!audioTrack.current) {
            confirmation = window.confirm("want to continue");
            if (confirmation) {
              await startWithAudio();
              if (audioTrack.current) {
                if (!connection.current) {
                  await createConnection(false);
                }
                connection.current.addTrack(audioTrack.current);
              }
            } else {
              socketRef.current.emit(
                "join-user",
                JSON.stringify({ rejected: "true" })
              );
            }
          }
          if (audioTrack.current) {
            if (!connection.current) {
              await createConnection(false);
            }
            await connection.current.setRemoteDescription(
              new RTCSessionDescription(message.current.offer)
            );

            let answer = await connection.current.createAnswer();
            await connection.current.setLocalDescription(answer);
            socketRef.current.emit(
              "join-user",
              JSON.stringify({ answer: answer })
            );
          }
        } else if (message.current.iceCandidate) {
          if (!connection.current) {
            await createConnection(false);
          }
          try {
            await connection.current.addIceCandidate(
              message.current.iceCandidate
            );
          } catch (error) {
            console.log("erro", error);
          }
        }
      });
    };
    hitSocket();
  }, []);

  const startConnection = async () => {
    await startWithAudio();
    await createConnection(true);
  };
  const startWithAudio = async () => {
    try {
      var aStream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });
      audioTrack.current = aStream.getAudioTracks()[0];
      audioTrack.current.onmute = function (e) {
        console.log(e);
      };
      audioTrack.current.onunmuted = function (e) {
        console.log(e);
      };
    } catch (error) {
      console.log("Audio Error", error);
    }
  };

  const createConnection = async (flag) => {
    connection.current = new RTCPeerConnection(ICE_config);
    // if (flag) await createUserOffer();

    connection.current.onicecandidate = function (event) {
      debugger;
      if (event.candidate) {
        socketRef.current.emit(
          "join-user",
          JSON.stringify({ iceCandidate: event.candidate })
        );
      }
    };

    connection.current.onnegotiationneeded = async function (event) {
      await createUserOffer();
    };

    connection.current.ontrack = function (event) {
      if (!remoteStream.current) remoteStream.current = new MediaStream();
      if (event.track.kind == "video") {
        remoteStream.current
          .getVideoTracks()
          .forEach((t) => remoteStream.current.removeTrack(t));
      }
      remoteStream.current.addTrack(event.track);
      remoteStream.current.getTracks().forEach((t) => console.log(t));
      remoteVideoCtr.current.srcObject = null;
      remoteVideoCtr.current.srcObject = remoteStream.current;
      remoteVideoCtr.current.load();
    };
    connection.current.onicecandidateerror = function (event) {
      console.log("onicecandidateerror", event);
    };

    connection.current.onicegatheringstatechange = function (event) {
      console.log("onicegatheringstatechange", event);
    };

    connection.current.onconnectionstatechange = function (event) {
      console.log("onconnectionstatechange", event);
    };
  };

  const createUserOffer = async () => {
    var offer = await connection.current.createOffer();
    await connection.current.setLocalDescription(offer);
    socketRef.current.emit(
      "join-user",
      JSON.stringify({ offer: connection.current.localDescription })
    );
  };

  const startStopCamera = async () => {
    setCameraLabelStatus(!isStop);
    if (videoTrack.current) {
      videoTrack.current.stop();
      videoTrack.current = null;
      videoCtr.current.srcObject = null;
      if (rtpSender.current && connection.current) {
        connection.current.removeTrack(rtpSender.current);
        rtpSender.current = null;
      }
      return;
    }
    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: false })
      .then((stream) => {
        videoTrack.current = stream.getVideoTracks()[0];
        setLocalVideo(true);
        // videoCtr.current.srcObject = stream;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const setLocalVideo = (isVideo) => {
    var currentTrack;
    if (isVideo) {
      if (videoTrack.current) {
        videoCtr.current.srcObject = new MediaStream([videoTrack.current]);
        currentTrack = videoTrack.current;
      }
    }

    if (
      rtpSender.current &&
      rtpSender.current.track &&
      currentTrack &&
      connection.current
    ) {
      rtpSender.current.replaceTrack(currentTrack);
    } else {
      if (currentTrack && connection.current)
        rtpSender.current = connection.current.addTrack(currentTrack);
    }
  };

  return (
    <>
      <div id="meetingbox" style="display: none;">
        <p>
          It seems you are not trying to join any meeting! You may start a new
          meeting. Here is generated for you. <a id="meetingid" href="#"></a>
        </p>
      </div>

      <div id="meetingContainer" style={{ display: "none" }}>
        <h1 id="meetingname"></h1>
        <div>
          <div
            style={{
              width: "200px",
              height: "300px",
              float: "left",
              "overflow-y": "scroll",
              display: "none",
            }}
            id="messages"
          >
            <div>
              <input type="text" id="msgbox" />
              <button id="btnsend">Send</button>
            </div>
          </div>
          <div id="divUsers" style={{ display: "none" }}>
            <div id="me" class="userbox">
              <h2></h2>
              <div>
                <video autoplay muted id="localVideoCtr" />
              </div>
            </div>
            <div id="otherTemplate" class="userbox" style={{ display: "none" }}>
              <h2></h2>
              <div>
                <video autoplay muted id="remoteVideoCtr111"></video>
                <audio
                  autoplay
                  controls
                  style={{ display: "none" }}
                  id="remoteAudioCtr111"
                ></audio>
              </div>
            </div>
          </div>
        </div>

        <div style={{ clear: "both" }}></div>
        <div class="toolbox" style={{ display: "none" }}>
          <button id="btnMuteUnmute">UnMute</button>
          <button id="btnStartStopCam">Start Camera</button>
          <button id="btnStartStopScreenshare">Screen Share</button>
          <button id="btnResetMeeting">Reset Meeting</button>
        </div>
      </div>
    </>
  );
};

export default Room;
