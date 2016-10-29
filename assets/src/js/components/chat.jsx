import React from 'react';
import postal from 'postal';
import {ChatList} from './chats';
import {UserList} from './users';
import {ChatForm} from './form';
import {findDOMNode} from 'react-dom';

export let ChatView = React.createClass({
  componentWillMount: function() {
    let channel = postal.channel();
    this._boundForceUpdate = this.forceUpdate.bind(this, null);
    this.props.chats.on('add change remove', this._boundForceUpdate, this);
    this.props.users.on('add change remove', this._boundForceUpdate, this);
    this.chatSub = channel.subscribe('Chat.Add', this.chatAdd);
  },
  componentWillUnmount: function() {
    this.props.chats.off('add change remove', this._boundForceUpdate);
    this.props.users.off('add change remove', this._boundForceUpdate);
    this.chatSub.unsubscribe();
  },
  componentDidUpdate: function() {
    let chatList = findDOMNode(this.refs.chatList);
    chatList.scrollTop = chatList.scrollHeight;
  },
  chatAdd: function(data) {
    this.props.chats.sync('create', {
      message: data.message,
      room: this.props.room
    });
  },
  render: function() {
    return (
      <div className="row">
        <div className="row">
          <div className="col-sm-2">
            <UserList collection={this.props.users} me={this.props.me} />
          </div>
          <div className="col-sm-8 chat-list" ref="chatList">
            <ChatList chats={this.props.chats} me={this.props.me} /> 
          </div>
        </div>
        <ChatForm me={this.props.me} />
      </div>
    );
  }
});
