import {Router as AppRouter} from 'backbone';

export let Router = AppRouter.extend({
  routes: {
    '': 'RoomSelection',
    'room/:room': 'JoinRoom',
    '*default': 'Default'
  }
});
