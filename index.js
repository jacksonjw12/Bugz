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

  socket.emit('state', user.getSerialState());

  socket.on('getState', () => {
  	 socket.emit('state', user.getSerialState());
  })

  socket.on('newGame', () => {
  	Room.newRoom(user);
  	 socket.emit('state', user.getSerialState());
  })

  socket.on('joinGame', (game) => {
  	console.log("join " + game.code)
  	const room = Room.get(game.code);
  	if(room) {
  		room.addPlayer(user);
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

server.listen(3000, () => {
  console.log('listening on *:3000');
});