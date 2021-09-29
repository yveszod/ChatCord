const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const {username, room} = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});
const socket = io();

socket.emit('joinRoom', {username, room});

socket.on('roomUsers', ({room, users}) => {
  outputRoom(room);
  outputUsers(users);
});

socket.on('msg', message => {
  console.log(message);
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  socket.emit('Chat Message', msg);
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

const outputMessage = message => {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.user} <span>${message.time}</span></p><p class="text">${message.text}</p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

const outputRoom = room => {
  document.getElementById('room-name').innerHTML = room;
}


const outputUsers = users => {
  const usersElement = document.getElementById('users');
  usersElement.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
}