(this["webpackJsonpweb-rtc-multipeer"]=this["webpackJsonpweb-rtc-multipeer"]||[]).push([[0],{49:function(e,n,t){},56:function(e,n,t){},61:function(e,n,t){"use strict";t.r(n);var r=t(0),c=t.n(r),o=t(36),u=t.n(o),a=(t(49),t(40)),i=t(2),s=t(63),d=t(1),l=function(e){return Object(d.jsx)(d.Fragment,{children:Object(d.jsx)("div",{id:"meetingbox",children:Object(d.jsxs)("p",{children:["It seems you are not trying to join any meeting! You may start a new meeting. Here is generated for you."," ",Object(d.jsx)("button",{onClick:function(){var n=Object(s.a)();e.history.push("/room/".concat(n))},children:"Create room"})]})})})},f=t(32),b=t(44),j=t(8),p=t.n(j),h=t(20),O=t(22),x=t(43),m=(t(56),{iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:stun1.l.google.com:19302"},{urls:"stun:stun2.l.google.com:19302"},{urls:"stun:stun3.l.google.com:19302"},{urls:"stun:stun4.l.google.com:19302"}]}),g=function(e){var n=Object(r.useRef)(null),t=Object(r.useRef)(null),c=Object(r.useRef)(null),o=Object(r.useRef)(null),u=Object(r.useRef)({None:0,Camera:1,ScreenShare:2}),a=Object(r.useRef)(u.current.None),i=Object(r.useRef)([]),s=Object(r.useRef)([]),l=Object(r.useRef)([]),j=Object(r.useRef)([]),g=Object(r.useRef)([]),v=Object(r.useRef)([]),k=Object(r.useRef)([]),S=Object(r.useState)([]),w=Object(O.a)(S,2),C=w[0],y=w[1],R=Object(r.useState)(!1),T=Object(O.a)(R,2),I=T[0],N=T[1],D=Object(r.useState)(!1),E=Object(O.a)(D,2),M=E[0],P=E[1],F=Object(r.useState)(""),J=Object(O.a)(F,2),A=J[0],L=J[1],U=Object(r.useState)(""),V=Object(O.a)(U,2),_=V[0],B=V[1],Y=Object(r.useState)(""),H=Object(O.a)(Y,2),q=H[0],z=H[1];console.log("peers",C),Object(r.useEffect)((function(){var n=e.match.params.mId,t=e.match.params.uId;n||e.history.push("/"),t||(t=window.prompt("Enter your nick"))||e.history.push("/"),z(n),B(t),G(n,t)}),[]);var G=function(e,t){n.current=x.a.connect("http://10.0.0.37:3001"),n.current.on("connect",(function(){n.current.connect&&(L(n.current.id),""!==t&&""!==e&&n.current.emit("userConnect",{displayName:t,meetingId:e}))})),n.current.on("userconnected",(function(e){e&&(null===e||void 0===e||e.forEach((function(e){W(e),X(e.connectionId)}))),N(!0)})),n.current.on("exchangeSDP",function(){var e=Object(h.a)(p.a.mark((function e(n){return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,$(n.message,n.from_connid);case 2:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}()),n.current.on("informAboutNewConnection",(function(e){W(e),X(e.connectionId)})),n.current.on("informAboutConnectionEnd",function(){var e=Object(h.a)(p.a.mark((function e(n){return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,K(n);case 2:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}())},K=function(e){g.current[e]=null,v.current[e]&&(v.current[e].close(),v.current[e]=null),s.current[e]&&(s.current[e].getTracks().forEach((function(e){e.stop&&e.stop()})),s.current[e]=null),i.current[e]&&(i.current[e].getTracks().forEach((function(e){e.stop&&e.stop()})),i.current[e]=null)},Q=function(e,t){n.current.emit("exchangeSDP",{message:e,to_connid:t})},W=function(e){var n={userId:e.user_id,connectionId:e.connectionId};y((function(e){return[].concat(Object(b.a)(e),[n])}))},X=function(e){return t.current=new RTCPeerConnection(m),t.current.onicecandidate=function(n){n.candidate&&Q(JSON.stringify({iceCandidate:n.candidate}),e)},t.current.onicecandidateerror=function(e){console.log("onicecandidateerror",e)},t.current.onicegatheringstatechange=function(e){console.log("onicegatheringstatechange",e)},t.current.onnegotiationneeded=function(){var n=Object(h.a)(p.a.mark((function n(t){return p.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return console.log("onnegotiationneeded",t),n.next=3,Z(e);case 3:case"end":return n.stop()}}),n)})));return function(e){return n.apply(this,arguments)}}(),t.current.onconnectionstatechange=function(e){"connected"===e.currentTarget.connectionState&&console.log("connected"),"disconnected"===e.currentTarget.connectionState&&console.log("disconnected")},t.current.ontrack=function(n){if(s.current[e]||(s.current[e]=new MediaStream),i.current[e]||(i.current[e]=new MediaStream),"video"===n.track.kind){var t;i.current[e].getVideoTracks().forEach((function(n){return i.current[e].removeTrack(n)})),i.current[e].addTrack(n.track);var r=null===l||void 0===l||null===(t=l.current)||void 0===t?void 0:t.find((function(n){return Object.keys(n)[0]==e}));r[e].srcObject=null,r[e].srcObject=i.current[e],r[e].load()}if("audio"===n.track.kind){s[e].getAudioTrack().forEach((function(n){return s[e].removeTrack(n)})),s.addTrack(n.track);var c=j.find((function(n){return n[e]==e}));c.srcObject=null,c.srcObject=s[e],c.load()}},g.current[e]=e,v.current[e]=t.current,a.current!=u.current.Camera&&a.current!=u.current.ScreenShare||c.current&&ce(c.current,k.current),t},Z=function(){var e=Object(h.a)(p.a.mark((function e(n){var t,r;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=v.current[n],e.next=4,t.createOffer();case 4:return r=e.sent,e.next=7,t.setLocalDescription(r);case 7:Q(JSON.stringify({offer:t.localDescription}),n);case 8:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),$=function(){var e=Object(h.a)(p.a.mark((function e(n,t){var r;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(n=JSON.parse(n)).answer){e.next=7;break}return e.next=5,v.current[t].setRemoteDescription(new RTCSessionDescription(n.answer));case 5:e.next=34;break;case 7:if(!n.offer){e.next=21;break}if(v.current[t]){e.next=11;break}return e.next=11,X(t);case 11:return e.next=13,v.current[t].setRemoteDescription(new RTCSessionDescription(n.offer));case 13:return e.next=15,v.current[t].createAnswer();case 15:return r=e.sent,e.next=18,v.current[t].setLocalDescription(r);case 18:Q(JSON.stringify({answer:r}),t,A.current),e.next=34;break;case 21:if(!n.iceCandidate){e.next=34;break}if(console.log("iceCandidate",n.iceCandidate),v.current[t]){e.next=26;break}return e.next=26,X(t);case 26:return e.prev=26,e.next=29,v.current[t].addIceCandidate(n.iceCandidate);case 29:e.next=34;break;case 31:e.prev=31,e.t0=e.catch(26),console.log(e.t0);case 34:case"end":return e.stop()}}),e,null,[[26,31]])})));return function(n,t){return e.apply(this,arguments)}}(),ee=function(){var e=Object(h.a)(p.a.mark((function e(){return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(P(!M),a.current!=u.current.Camera){e.next=6;break}return e.next=4,ne(u.current.None);case 4:e.next=8;break;case 6:return e.next=8,ne(u.current.Camera);case 8:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),ne=function(){var e=Object(h.a)(p.a.mark((function e(n){var t;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n!==u.current.None){e.next=4;break}return a.current=u.current.None,te(k.current),e.abrupt("return");case 4:if(e.prev=4,t=null,n!==u.current.Camera){e.next=10;break}return e.next=9,navigator.mediaDevices.getUserMedia({video:{width:720,height:480},audio:!1});case 9:t=e.sent;case 10:te(k.current),a.current=n,t&&t.getVideoTracks().length>0&&(c.current=t.getVideoTracks()[0],c.current&&(o.current.srcObject=new MediaStream([c.current]),ce(c.current,k.current))),e.next=17;break;case 15:e.prev=15,e.t0=e.catch(4);case 17:case"end":return e.stop()}}),e,null,[[4,15]])})));return function(n){return e.apply(this,arguments)}}(),te=function(e){c.current&&(c.current.stop(),c.current=null,o.current.srcObject=null,re(e))},re=function(e){for(var n in g.current)e[n]&&oe(v.current[n])&&(v.current[n].removeTrack(e[n]),e[n]=null)},ce=function(){var e=Object(h.a)(p.a.mark((function e(n,t){var r;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:for(r in g.current)oe(v.current[r])&&(t[r]&&t[r].track?t[r].replaceTrack(n):t[r]=v.current[r].addTrack(n));case 1:case"end":return e.stop()}}),e)})));return function(n,t){return e.apply(this,arguments)}}(),oe=function(e){return!!(e&&"new"===e.connectionState||"connecting"==e.connectionState||"connected"==e.connectionState)};return Object(d.jsx)(d.Fragment,{children:Object(d.jsxs)("div",{id:"meetingContainer",children:[Object(d.jsx)("h1",{id:"meetingname",children:q}),Object(d.jsxs)("div",{children:[I?Object(d.jsx)("div",{style:{width:"200px",height:"300px",float:"left",overflowY:"scroll"},id:"messages",children:Object(d.jsxs)("div",{children:[Object(d.jsx)("input",{type:"text",id:"msgbox"}),Object(d.jsx)("button",{id:"btnsend",children:"Send"})]})}):null,I?Object(d.jsxs)("div",{id:"divUsers",children:[Object(d.jsxs)("div",{id:"me",className:"userbox",children:[Object(d.jsx)("h2",{children:_}),Object(d.jsx)("div",{children:Object(d.jsx)("video",{autoPlay:!0,muted:!0,controls:!0,ref:o})})]}),(null===C||void 0===C?void 0:C.length)>0&&C.map((function(e,n){return Object(d.jsxs)("div",{className:"userbox",children:[Object(d.jsx)("h2",{children:e.userId}),Object(d.jsxs)("div",{children:[Object(d.jsx)("video",{ref:function(n){l.current.push(Object(f.a)({},e.connectionId,n))},autoPlay:!0,controls:!0,muted:!0,id:"remoteVideoCtr111"}),Object(d.jsx)("audio",{ref:function(n){j.current.push(Object(f.a)({},e.connectionId,n))},autoPlay:!0,controls:!0,id:"remoteAudioCtr111"})]})]},e.connectionId)}))]}):null]}),Object(d.jsx)("div",{style:{clear:"both"}}),I?Object(d.jsxs)("div",{className:"toolbox",children:[Object(d.jsxs)("button",{onClick:ee,id:"btnStartStopCam",children:[" ",M?"Stop Camera":"Start Camera"," "]}),Object(d.jsx)("button",{id:"btnMuteUnmute",children:"UnMute"}),Object(d.jsx)("button",{id:"btnStartStopScreenshare",children:"Screen Share"}),Object(d.jsx)("button",{id:"btnResetMeeting",children:"Reset Meeting"})]}):null]})})};var v=function(){return Object(d.jsx)(a.a,{children:Object(d.jsxs)(i.c,{children:[Object(d.jsx)(i.a,{path:"/",exact:!0,component:l}),Object(d.jsx)(i.a,{path:"/room/:mId?/:uId?",component:g})]})})},k=function(e){e&&e instanceof Function&&t.e(3).then(t.bind(null,64)).then((function(n){var t=n.getCLS,r=n.getFID,c=n.getFCP,o=n.getLCP,u=n.getTTFB;t(e),r(e),c(e),o(e),u(e)}))};u.a.render(Object(d.jsx)(c.a.StrictMode,{children:Object(d.jsx)(v,{})}),document.getElementById("root")),k()}},[[61,1,2]]]);
//# sourceMappingURL=main.805c18b0.chunk.js.map