import React, { Component } from "react";
import UserView from "./User";
import moment from "moment";

const Message = ({ chat, styles: { pull }, time }) => (
  <li>
    <div className={"bg-primary chat-message " + pull}>
      {chat.get("message")}
    </div>
    <div className="clearfix" />
    <div className={pull}>
      <UserView user={chat.get("user")} size={20} useName={true}>
        <small>{time}</small>
      </UserView>
    </div>
    <div className="clearfix" />
  </li>
);

export default class extends Component {
  render() {
    let pull = this.props.me.id === this.props.chat.get("user").id
      ? "pull-right"
      : "pull-left";
    let timeAgo = moment(this.props.chat.get("ts")).fromNow();
    return <Message chat={this.props.chat} time={timeAgo} styles={{ pull }} />;
  }
}
