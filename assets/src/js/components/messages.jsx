import {ChatMessage} from './message';
import React from 'react';

export let ChatList = React.createClass({
  render: function() {
    let me = this.props.me;
    return (
      <ul className="list-unstyled">
      {this.props.chats.map(function(chat) {
        return (
          <ChatMessage chat={chat} me={me} />
        );
      });
      }
      </ul>
    );
  }
});
