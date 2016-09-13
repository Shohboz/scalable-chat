// import {UserView} from './components/user';
// import {RoomForm} from "./components/room";
import io from 'socket.io-client';
import {history} from 'backbone';
import Backbone from 'backbone';
import {Router} from './router';
import {SocketSync, SocketListener} from './helpers/socket';
import {RoomCollection, UserCollection, ChatCollection} from './entities/models';
import postal from 'postal';

let me = null,
connected = false,
router,
roomCollection,
userCollection,
chatCollection;

export let App = (el) => {
  let $root = $(`#${el}`);
  let socket = io.connect("<!-- @SOCKETIO_URL -->");

  let GetMe = (user) => {
    history.stop();
    startChat();
    history.start();
    connected = true;
  };

  function roomSelection(){
  }
  function joinRoom(room){
  }
  function defaultRoute(){
  }

  let roomFormEvent = (message) => {
    console.warn('message ', message);
  };

  let startChat = () => {
    router = new Router();

    Backbone.socket = socket;
    Backbone.sync = SocketSync;

    roomCollection = new RoomCollection();
    roomCollection.noun = 'Room';
    userCollection = new UserCollection();
    userCollection.noun = 'User';
    chatCollection = new ChatCollection();
    chatCollection.noun = 'Chat';

    let roomsSync = new SocketListener('Room', roomCollection, socket);
    let usersSync = new SocketListener('User', userCollection, socket);
    let chatSync = new SocketListener('Chat', chatCollection, socket);

    roomCollection.fetch();

    let myChannel = postal.channel();
    let JoinRoom = myChannel.subscribe('Room.Join', roomFormEvent);

    router.on('router:RoomSelection', roomSelection);
    router.on('router:JoinRoom', joinRoom);
    router.on('router:Default', defaultRoute);
  };

  socket.on('connect', () => {
    if (!connected) socket.emit('GetMe');
  });

  socket.on('GetMe', GetMe);
};