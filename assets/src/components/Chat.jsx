import React, { Component } from "react";
import { findDOMNode } from "react-dom";
import postal from "postal";
import ChatList from "./Chats";
import UserList from "./Users";
import ChatForm from "./Form";

export default class extends Component {
  componentWillMount() {
    let channel = postal.channel();
    this._boundForceUpdate = this.forceUpdate.bind(this, null);
    this.props.chats.on("add change remove", this._boundForceUpdate, this);
    this.props.users.on("add change remove", this._boundForceUpdate, this);
    this.chatSub = channel.subscribe("Chat.Add", this.chatAdd);
  }

  componentWillUnmount() {
    this.props.chats.off("add change remove", this._boundForceUpdate);
    this.props.users.off("add change remove", this._boundForceUpdate);
    this.chatSub.unsubscribe();
  }

  componentDidUpdate() {
    let chatList = findDOMNode(this.refs.chatList);
    chatList.scrollTop = chatList.scrollHeight;
  }

  chatAdd = data => {
    const { room, chats } = this.props;
    chats.sync("create", {
      message: data.message,
      room
    });
  };

  render() {
    const { me, users, chats } = this.props;
    return (
      <div className="row">
        <div className="row">
          <div className="col-sm-2">
            <UserList collection={users} me={me} />
          </div>
          <div className="col-sm-8 chat-list" ref="chatList">
            <ChatList chats={chats} me={me} />
          </div>
        </div>
        <ChatForm me={me} />
      </div>
    );
  }
}
