const express = require('express');
const app = express();
const http = require('http');
var cookieParser = require('cookie-parser')
const {serialize, parse} = require('cookie')

const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let {User} = require('./Models/User.js');
let {Room} = require('./Models/Room.js');
let {Game} = require('./Models/Game.js');


const session = require("express-session")({
	secret: "my-secret",
	resave: true,
	saveUninitialized: true,
	maxAge: 86400
});
const sharedsession = require("express-socket.io-session");
const cookies = cookieParser();
app.use(cookies)
app.use(session);
 
// Share session with io sockets
io.use(sharedsession(session, cookies, {
    autoSave:true
}));


io.on('connection', (socket) => {

console.log(socket.handshake.session.userdata);
  if(!socket.handshake.session.userdata) {
  	const newUser = User.newUser(socket);
  	socket.handshake.session.userdata = newUser.id;
  	socket.handshake.session.save();
  }
  const user = User.get(socket.handshake.session.userdata);
  user.updateSocket(socket);

  socket.emit('state', user.getSerialState());

  socket.on('getState', () => {
  	 socket.emit('state', user.getSerialState());
  })

  socket.on('requestNewID', () => {
  	if(!user.room) {
  		user.newID((newId) => {
  			socket.handshake.session.userdata = newId;
  			socket.handshake.session.save();
  		});
  		
  	}
  })


  socket.on('setupTestState', () => {
    const room = Room.newRoom(user);
    const u2 = User.newUser();
    room.addPlayer(user);
    room.startTestGame(user.id, u2.id);

  })

  socket.on('newGame', () => {
  	Room.newRoom(user);
  	 socket.emit('state', user.getSerialState());
  })

  socket.on('joinRoom', (roomData) => {
  	const room = Room.get(roomData.code);
  	if(room) {
  		room.addPlayer(user);
  	}

  })
  socket.on('leaveRoom', () => {
  	if(user.room) {
  		user.room.removePlayer(user);
  	}

  })
  socket.on('leaveGame', (game) => {
  	if(user.room && user.room.game) {
  		user.room.endGame(undefined, user.id);
  	}
  })

  socket.on('startGame', () => {
  	if(user.room) {
  		user.room.startGame();
  	}
  })

  socket.on('submitMove', (move) => {
  	if(user.room && user.room.game) {
  		user.room.game.applyNextMove(move);
  	}
  })

  


  socket.on('disconnect', () => {
    User.logoutUser(socket.handshake.session.userdata);
    delete socket.handshake.session.userdata;
  });
});


app.use(express.static(__dirname + '/client'))

app.get('/test', function(req, res){
  res.sendFile(__dirname + '/client/test.html');
});


server.listen(3000, () => {
  console.log('listening on *:3000');
});