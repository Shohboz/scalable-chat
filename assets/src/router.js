import { Router as AppRouter } from "backbone";

const Router = AppRouter.extend({
  routes: {
    "": "RoomSelection",
    "room/:room": "JoinRoom",
    "*default": "Default"
  }
});

export default Router;
