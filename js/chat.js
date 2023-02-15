//로그인 시스템 대신 임시받편
let username = prompt("아이디를 입력하세요");
let roomNum = prompt("채팅방 번호를 입력하세요");

document.querySelector("#username").innerHTML = username;

// SSE 연결하기
const evnetSource = new EventSource(
  `http://localhost:8080/chat/roomNum/${roomNum}`
);

// const evnetSource = new evnetSource(
//   "http://localhost:8080/sender/ssar/receiver/cos"
// );
// evnetSource.onmessage = (event) => {
//   const data = JSON.parse(event.data);
//   initMessage(data.msg);
// };

evnetSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.sender === username) {
    // 로그인한 유저가 보낸 메세지
    // 파란박스(오른쪽)
    initMyMessage(data);
  } else {
    // 회색박스(왼쪽)
  }
  // initMessage(data);
};

// 파란박스 만들기
// function getSendMsgBox(msg, time) {
function getSendMsgBox(data) {
  let md = data.createdAt.substring(5, 10);
  let tm = data.createdAt.substring(11, 16);
  convertTime = tm + "|" + md;

  return `<div class="sent_msg">
    <p>${data.msg}</p>
    <span class="time_date">${convertTime} / <b>${data.sender}</b> </span>
</div>`;
}

// 회색박스 만들기
function getReceiveMsgBox(data) {
  let md = data.createdAt.substring(5, 10);
  let tm = data.createdAt.substring(11, 16);
  convertTime = tm + "|" + md;
  return `<div class="received_withd_msg">
    <p>${data.msg}</p>
    <span class="time_date">${convertTime} / <b>${data.sender}</b> </span>
</div>`;
}

// 최초 초기화 될 때 ex) 1번방 3건 있으면 3건다 가져옴
// addMessage() 함수 호출시 DB에 insert되고, 그 데이터가 자동으로 흘러들어온다 (SSE)
// 메시지 파란박스 초기화하기
function initMyMessage(data) {
  let chatBox = document.querySelector("#chat-box");
  // let msgInput = document.querySelector("#chat-outgoing-msg");
  // alert(msgInput.value);

  let sendBox = document.createElement("div");
  sendBox.className = "outgoing_msg";

  // chatOutgoingBox.innerHTML = getSendMsgBox(data.msg, data.createdAt);
  sendBox.innerHTML = getSendMsgBox(data);
  chatBox.append(sendBox);
  // msgInput.value = "";
  document.documentElement.scrollTop = document.body.scrollHeight;
}

// 회색 박스 초기화하기
function initYouerMessage(data) {
  let chatBox = document.querySelector("#chat-box");
  let receivedMox = document.createElement("div");
  receivedMox.className = "received_msg";
  receivedMox.innerHTML = getReceiveMsgBox(data);
  chatBox.append(receivedMox);
  document.documentElement.scrollTop = document.body.scrollHeight;
}

// AJAX로 채팅 메시지를 전송
async function addMessage() {
  // let chatBox = document.querySelector("#chat-box"); //직접 apend해서 넣어줄 필요 없음
  let msgInput = document.querySelector("#chat-outgoing-msg");
  // alert(msgInput.value);
  // let chatOutgoingBox = document.createElement("div");
  // chatOutgoingBox.className = "outgoing_msg";
  // let date = new Date();
  // let now =
  //   date.getHours() +
  //   ":" +
  //   date.getMinutes() +
  //   " | " +
  //   (date.getMonth() + 1) +
  //   "/" +
  //   date.getDate();

  let chat = {
    sender: username, //"ssar",
    //receiver: "cos",
    roomNum: roomNum,
    msg: msgInput.value,
  };

  //let response = await fetch("http://localhost:8080/chat", { //응답받을 필요 없음 DB에 insert만 하면 됨
  fetch("http://localhost:8080/chat", {
    method: "post", //http post 메서드 (새로운 데이터를 write)
    body: JSON.stringify(chat), // JS -> JSON
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });

  // console.log(response);
  // let parseResponse = await response.json();
  // console.log(parseResponse);

  // chatOutgoingBox.innerHTML = getSendMsgBox(msgInput.value, now);
  // chatBox.append(chatOutgoingBox);
  msgInput.value = ""; //패치요청해서 잘되면 메시지 내용만 비워주면됨
}

// 버튼 클릭시 메시지 전송
document
  .querySelector("#chat-outgoing-button")
  .addEventListener("click", () => {
    // alert("클릭됨");
    addMessage();
  });

// 엔터를 치면 메시지 전송
document
  .querySelector("#chat-outgoing-msg")
  .addEventListener("keydown", (e) => {
    if (e.keyCode === 13) {
      addMessage();
    }
  });
