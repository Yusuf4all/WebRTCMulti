import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./room.css";

const iceConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },
  ],
};

const Room = (props) => {
  const socketRef = useRef(null);
  const connection = useRef(null);
  const videoCamSSTrack = useRef(null);
  const localVideoPlayer = useRef(null);

  const videoStates = useRef({ None: 0, Camera: 1, ScreenShare: 2 });
  const videoState = useRef(videoStates.current.None);

  const remoteVideoStreams = useRef([]);
  const remoteAudioStreams = useRef([]);
  const refsVidoArray = useRef([]);
  const refsAudioArray = useRef([]);
  const peersConIds = useRef([]);
  const peersConns = useRef([]);
  const rtpVideoSenders = useRef([]);

  const [peers, setPeer] = useState([]);
  const [isNewUser, setNewUser] = useState(false);

  const [btnLabel, setBtnLabel] = useState({
    isCamera: false,
    isShare: false,
    isMute: false,
  });

  const [myConnid, setMyconnectionId] = useState("");
  const [userName, setUserName] = useState("");
  const [meetingName, setMeetingName] = useState("");

  console.log("peers", peers);

  useEffect(() => {
    let meetingId = props.match.params.mId;
    let uId = props.match.params.uId;
    if (!meetingId) {
      props.history.push("/");
    }
    if (!uId) {
      uId = window.prompt("Enter your nick");
      if (!uId) {
        props.history.push("/");
      }
    }
    setMeetingName(meetingId);
    setUserName(uId);
    initialization(meetingId, uId);
  }, []);

  const initialization = (meeting_Id, user_Id) => {
    socketRef.current = io.connect("http://10.0.0.37:3001");
    socketRef.current.on("connect", () => {
      if (socketRef.current.connect) {
        setMyconnectionId(socketRef.current.id);
        // wrtcInitilization(socketRef.current.id);
        if (user_Id !== "" && meeting_Id !== "") {
          socketRef.current.emit("userConnect", {
            displayName: user_Id,
            meetingId: meeting_Id,
          });
        }
      }
    });

    socketRef.current.on("userconnected", (other_users) => {
      debugger;
      if (other_users) {
        other_users?.forEach((other_user) => {
          addNewUser(other_user);
          createNewConnection(other_user.connectionId);
        });
      }
      setNewUser(true);
    });

    socketRef.current.on("exchangeSDP", async function (data) {
      await exchangeSDP(data.message, data.from_connid);
    });

    socketRef.current.on("informAboutNewConnection", function (data) {
      debugger;
      addNewUser(data);
      createNewConnection(data.connectionId);
    });

    socketRef.current.on("informAboutConnectionEnd", async (connetionId) => {
      await closeConnection(connetionId);
    });
  };

  const closeConnection = (connectionId) => {
    peersConIds.current[connectionId] = null;
    if (peersConns.current[connectionId]) {
      peersConns.current[connectionId].close();
      peersConns.current[connectionId] = null;
    }

    if (remoteAudioStreams.current[connectionId]) {
      remoteAudioStreams.current[connectionId].getTracks().forEach((track) => {
        if (track.stop) track.stop();
      });
      remoteAudioStreams.current[connectionId] = null;
    }

    if (remoteVideoStreams.current[connectionId]) {
      remoteVideoStreams.current[connectionId].getTracks().forEach((track) => {
        if (track.stop) track.stop();
      });
      remoteVideoStreams.current[connectionId] = null;
    }
  };

  const serverFn = (data, to_connid) => {
    socketRef.current.emit("exchangeSDP", {
      message: data,
      to_connid: to_connid,
    });
  };

  // const wrtcInitilization = (socket_Id) => {};

  const addNewUser = (data) => {
    let peer = {
      userId: data.user_id,
      connectionId: data.connectionId,
    };
    setPeer((oldValue) => [...oldValue, peer]);
  };

  const createNewConnection = (connid) => {
    connection.current = new RTCPeerConnection(iceConfiguration);

    connection.current.onicecandidate = function (event) {
      if (event.candidate) {
        serverFn(JSON.stringify({ iceCandidate: event.candidate }), connid);
      }
    };

    connection.current.onicecandidateerror = function (event) {
      console.log("onicecandidateerror", event);
    };
    connection.current.onicegatheringstatechange = function (event) {
      console.log("onicegatheringstatechange", event);
    };
    connection.current.onnegotiationneeded = async function (event) {
      console.log("onnegotiationneeded", event);
      await createOffer(connid);
    };
    connection.current.onconnectionstatechange = function (event) {
      if (event.currentTarget.connectionState === "connected") {
        console.log("connected");
      }
      if (event.currentTarget.connectionState === "disconnected") {
        console.log("disconnected");
      }
    };

    connection.current.ontrack = function (event) {
      debugger;
      if (!remoteAudioStreams.current[connid]) {
        remoteAudioStreams.current[connid] = new MediaStream();
      }
      if (!remoteVideoStreams.current[connid]) {
        remoteVideoStreams.current[connid] = new MediaStream();
      }

      if (event.track.kind === "video") {
        remoteVideoStreams.current[connid]
          .getVideoTracks()
          .forEach((track) =>
            remoteVideoStreams.current[connid].removeTrack(track)
          );
        remoteVideoStreams.current[connid].addTrack(event.track);

        let videoEle = refsVidoArray?.current?.find(
          (ele) => Object.keys(ele)[0] == connid
        );
        videoEle[connid].srcObject = null;
        videoEle[connid].srcObject = remoteVideoStreams.current[connid];
        videoEle[connid].load();
      }

      if (event.track.kind === "audio") {
        remoteAudioStreams[connid]
          .getAudioTrack()
          .forEach((track) => remoteAudioStreams[connid].removeTrack(track));
        remoteAudioStreams.addTrack(event.track);
        let videoEle = refsAudioArray.find((ele) => ele[connid] == connid);
        videoEle.srcObject = null;
        videoEle.srcObject = remoteAudioStreams[connid];
        videoEle.load();
      }
    };

    peersConIds.current[connid] = connid;
    peersConns.current[connid] = connection.current;

    if (
      videoState.current == videoStates.current.Camera ||
      videoState.current == videoStates.current.ScreenShare
    ) {
      if (videoCamSSTrack.current) {
        AddUpdateAudioVideoSenders(
          videoCamSSTrack.current,
          rtpVideoSenders.current
        );
      }
    }

    return connection;
  };

  const createOffer = async (connid) => {
    debugger;
    let connection = peersConns.current[connid];
    let offer = await connection.createOffer();
    await connection.setLocalDescription(offer);
    serverFn(JSON.stringify({ offer: connection.localDescription }), connid);
  };

  const exchangeSDP = async (message, from_connid) => {
    debugger;
    message = JSON.parse(message);
    if (message.answer) {
      await peersConns.current[from_connid].setRemoteDescription(
        new RTCSessionDescription(message.answer)
      );
    } else if (message.offer) {
      if (!peersConns.current[from_connid]) {
        await createNewConnection(from_connid);
      }

      await peersConns.current[from_connid].setRemoteDescription(
        new RTCSessionDescription(message.offer)
      );
      var answer = await peersConns.current[from_connid].createAnswer();
      await peersConns.current[from_connid].setLocalDescription(answer);
      serverFn(
        JSON.stringify({ answer: answer }),
        from_connid,
        myConnid.current
      );
    } else if (message.iceCandidate) {
      console.log("iceCandidate", message.iceCandidate);
      if (!peersConns.current[from_connid]) {
        await createNewConnection(from_connid);
      }

      try {
        await peersConns.current[from_connid].addIceCandidate(
          message.iceCandidate
        );
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleStartStopCamera = async () => {
    setBtnLabel({ ...btnLabel, isCamera: !btnLabel.isCamera });

    if (videoState.current == videoStates.current.Camera) {
      await manageVideo(videoStates.current.None);
    } else {
      await manageVideo(videoStates.current.Camera);
    }
  };

  const manageVideo = async (newVideoStatus) => {
    if (newVideoStatus === videoStates.current.None) {
      videoState.current = videoStates.current.None;
      clearCurrentVideoStream(rtpVideoSenders.current);
      return;
    }

    try {
      var vStream = null;
      if (newVideoStatus === videoStates.current.Camera) {
        vStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 720, height: 480 },
          audio: false,
        });
      } else if (newVideoStatus === videoStates.current.ScreenShare) {
        vStream = await navigator.mediaDevices.getDisplayMedia({
          audio: true,
          video: {
            frameRate: 1,
          },
        });
        vStream.oninactive = (event) => {
          debugger;
          clearCurrentVideoStream(rtpVideoSenders.current);
        };
      }

      clearCurrentVideoStream(rtpVideoSenders.current);
      videoState.current = newVideoStatus;
      if (vStream && vStream.getVideoTracks().length > 0) {
        videoCamSSTrack.current = vStream.getVideoTracks()[0];
        if (videoCamSSTrack.current) {
          localVideoPlayer.current.srcObject = new MediaStream([
            videoCamSSTrack.current,
          ]);
          AddUpdateAudioVideoSenders(
            videoCamSSTrack.current,
            rtpVideoSenders.current
          );
        }
      }
    } catch (error) {}
  };

  const clearCurrentVideoStream = (rtpVideoSenders) => {
    if (videoCamSSTrack.current) {
      videoCamSSTrack.current.stop();
      videoCamSSTrack.current = null;
      localVideoPlayer.current.srcObject = null;
      removeAudioVideoSenders(rtpVideoSenders);
    }
  };

  const removeAudioVideoSenders = (rtpVideoSenders) => {
    for (var conId in peersConIds.current) {
      if (
        rtpVideoSenders[conId] &&
        isConnedtionAvailable(peersConns.current[conId])
      ) {
        peersConns.current[conId].removeTrack(rtpVideoSenders[conId]);
        rtpVideoSenders[conId] = null;
      }
    }
  };

  const AddUpdateAudioVideoSenders = async (track, rtpSenders) => {
    for (var conId in peersConIds.current) {
      if (isConnedtionAvailable(peersConns.current[conId])) {
        if (rtpSenders[conId] && rtpSenders[conId].track) {
          rtpSenders[conId].replaceTrack(track);
        } else {
          rtpSenders[conId] = peersConns.current[conId].addTrack(track);
        }
      }
    }
  };

  const isConnedtionAvailable = (peerConnection) => {
    if (peerConnection) {
      if (
        peerConnection.connectionState === "new" ||
        peerConnection.connectionState == "connecting" ||
        peerConnection.connectionState == "connected"
      ) {
        return true;
      }
    } else return false;
  };

  const handleStartStopScreenshar = async () => {
    setBtnLabel({ ...btnLabel, isShare: !btnLabel.isShare });

    if (videoState === videoStates.current.ScreenShare) {
      await manageVideo(videoStates.current.None);
    } else {
      await manageVideo(videoStates.current.ScreenShare);
    }
  };

  return (
    <>
      <div id="meetingContainer">
        <h1 id="meetingname">{meetingName}</h1>
        <div>
          {isNewUser ? (
            <div
              style={{
                width: "200px",
                height: "300px",
                float: "left",
                overflowY: "scroll",
              }}
              id="messages"
            >
              <div>
                <input type="text" id="msgbox" />
                <button id="btnsend">Send</button>
              </div>
            </div>
          ) : null}

          {isNewUser ? (
            // {true ? (
            <div id="divUsers">
              <div id="me" className="userbox">
                <h2>{userName}</h2>
                <div>
                  <video autoPlay muted controls ref={localVideoPlayer} />
                </div>
              </div>

              {peers?.length > 0 &&
                peers.map((otherUser, index) => {
                  return (
                    <div className="userbox" key={otherUser.connectionId}>
                      <h2>{otherUser.userId}</h2>
                      <div>
                        <video
                          ref={(ref) => {
                            refsVidoArray.current.push({
                              [otherUser.connectionId]: ref,
                            });
                          }}
                          autoPlay
                          controls
                          muted
                          id="remoteVideoCtr111"
                        ></video>

                        <audio
                          ref={(ref) => {
                            refsAudioArray.current.push({
                              [otherUser.connectionId]: ref,
                            });
                          }}
                          autoPlay
                          controls
                          id="remoteAudioCtr111"
                        ></audio>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : null}
        </div>

        <div style={{ clear: "both" }}></div>

        {isNewUser ? (
          <div className="toolbox">
            <button onClick={handleStartStopCamera} id="btnStartStopCam">
              {" "}
              {btnLabel.isCamera ? "Stop Camera" : "Start Camera"}{" "}
            </button>
            <button
              onClick={handleStartStopScreenshar}
              id="btnStartStopScreenshare"
            >
              {btnLabel.isShare ? "Stop Screen Share" : "Screen Share"}
            </button>
            <button id="btnMuteUnmute">UnMute</button>
            <button id="btnResetMeeting">Reset Meeting</button>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Room;
