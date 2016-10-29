import React from 'react';
import {ChatMessage} from './message';

export let ChatList = React.createClass({
  render: function() {
    let me = this.props.me;
    return (
      <ul className="list-unstyled">
      {this.props.chats.map(function(chat) {
        console.warn('chat ', chat);
        return (
          <ChatMessage chat={chat} me={me} />
        );
      })
      }
      </ul>
    );
  }
});
