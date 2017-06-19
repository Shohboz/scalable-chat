import { Model, Collection } from "backbone";
import { map } from "underscore";
import md5 from "md5";

export let User = Model.extend({
  image: function(size) {
    switch (this.get("type")) {
      case "local":
        return this.gravatar(size);
      case "facebook":
        return this.facebook(size);
      default:
        break;
    }
  },
  gravatar: function(size) {
    return `http://gravatar.com/avatar/${md5(this.get("id"))}?d=retro&s=${size}`;
  },
  facebook: function(size) {
    return `http://graph.facebook.com/${this.get("id")}/picture/?height=${size}`;
  }
});

export let UserCollection = Collection.extend({
  model: User
});

export let RoomCollection = Collection.extend();

export let ChatCollection = Collection.extend({
  parse: data => {
    if (Array.isArray(data)) {
      return map(data, d => {
        d.user = new User(d.user);
        return d;
      });
    } else {
      data.user = new User(data.user);
      return data;
    }
  }
});
