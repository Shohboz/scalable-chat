import React, { Component } from "react";
import postal from "postal";
import ReactDOM from "react-dom";

export default class extends Component {
  componentWillMount() {
    this.channel = postal.channel();
    this._boundForceUpdate = this.forceUpdate.bind(this, null);
    this.props.rooms.on("add change remove", this._boundForceUpdate, this);
  }

  componentWillUnmount() {
    this.props.rooms.off("add change remove", this._boundForceUpdate);
  }

  joinRoomHandler = () => {
    this.channel.publish("Room.Join", {
      roomName: ReactDOM.findDOMNode(this.refs.roomName).value
    });
  };

  render() {
    return (
      <div className="col-sm-8 col-sm-offset-2">
        <h2>Please select the room</h2>
        <input
          type="text"
          placeholder="Room Name"
          className="form-control"
          ref="roomName"
        />
        <button
          className="btn btn-primary btn-block top-margin"
          onClick={this.joinRoomHandler}
        >
          Join Room
        </button>
        <ul>
          {this.props.rooms.map((room, idx) => {
            return (
              <li key={idx} className="list-unstyled">
                <a href={"#room/" + room.get("id")}>{room.get("id")}</a>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
