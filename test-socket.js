const { io } = require('socket.io-client');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODQ3YzY0NjVlMWQ3MzA4NjllZDEwODkiLCJlbWFpbCI6ImZhcnJ1a2h3ZWJwZW50ZXJAZ21haWwuY29tIiwicm9sZSI6Imhvc3QiLCJpYXQiOjE3NDk2Mzc3MzcsImV4cCI6MTc0OTcyNDEzN30.I1X4t-dkMZXAVlvR1alGjSq02RIsf_kIMF3Z8QzeQqQ';

const socket = io('http://localhost:3000', {
  auth: { token }
});

const roomId = '68492e0d856a68598aabb5cb'; // ✅ real Room._id
const receiverId = '6847c6465e1d730869ed1089'; // ✅ real User._id

socket.on('connect', () => {
  console.log('✅ Connected');

  socket.emit('joinRoom', roomId); // join actual room
  socket.emit('message', {
    room: roomId,
    receiver: receiverId,
    message: 'Hello again 👋'
  });
});

socket.on('message', (msg) => {
  console.log('📥 Received:', msg);
});
