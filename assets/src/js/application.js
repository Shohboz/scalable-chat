import io from 'socket.io-client';
import {history} from 'backbone';
import Backbone from 'backbone';
import {Router} from './router';
// import {SocketSync, SocketListener} from './helpers/socket';
import {SocketSync} from './helpers/socket';
import {RoomCollection, UserCollection, ChatCollection} from './entities/models';
// import postal from 'postal';
import ReactDOM from 'react-dom';
import {RoomForm} from './components/room';
import $ from 'jquery';

// let me = null,
let connected = false;
let router;
let roomCollection;
let userCollection;
let chatCollection;

// export let App = (el) => {
export let App = (el) => {
  let $root = $(`#${el}`);
  let socket = io.connect('<!-- @SOCKETIO_URL -->');

  function roomSelection() {
    roomCollection.sync('create', {name: 'lobby', id: 'lobby'});
    // console.info ('roomsColl ', roomCollection);
    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode($root[0]));
    ReactDOM.render(<RoomForm rooms={roomCollection} />, $root[0]);
  }
  function joinRoom() {
  // function joinRoom(room){
    // userCollection.reset();
    // chatCollection.reset();
    // roomCollection.sync('create', {name: room, id: room});
    // chatCollection.fetch({room: room});
    // userCollection.fetch({room: room});
    // ReactDOM.unmountComponentAtNode($root[0]);
    // ReactDOM.render(
    //<ChatView users={userCollection} chats={chatCollection} room={room} me={me} />,
    // $root[0]);
  }
  function defaultRoute() {
    router.navigate('', {trigger: true});
  }

  // let roomFormEvent = (message) => {
  //   console.warn('message ', message);
  // };

  function startChat() {
    router = new Router();

    Backbone.socket = socket;
    Backbone.sync = SocketSync;

    roomCollection = new RoomCollection();
    roomCollection.noun = 'Room';
    userCollection = new UserCollection();
    userCollection.noun = 'User';
    chatCollection = new ChatCollection();
    chatCollection.noun = 'Chat';

    // let roomsSync = new SocketListener('Room', roomCollection, socket);
    // let usersSync = new SocketListener('User', userCollection, socket);
    // let chatSync = new SocketListener('Chat', chatCollection, socket);

    roomCollection.fetch();

    // let myChannel = postal.channel();
    // let JoinRoom = myChannel.subscribe('Room.Join', roomFormEvent);

    router.on('router:RoomSelection', roomSelection);
    router.on('router:JoinRoom', joinRoom);
    router.on('router:Default', defaultRoute);
  }

  socket.on('connect', () => {
    if (!connected) {
      socket.emit('GetMe');
    }
  });

  let GetMe = (user) => {
    console.info('user ', user);
    history.stop();
    startChat();
    history.start();
    connected = true;
  };

  socket.on('GetMe', GetMe);
};
