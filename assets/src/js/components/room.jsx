import React from 'react';
import postal from 'postal';
import ReactDOM from 'react-dom';

export let RoomForm = React.createClass({
  componentWillMount: function () {
    this.channel = postal.channel();
    this._boundForceUpdate = this.forceUpdate.bind(this, null);
    this.props.rooms.on('add change remove', this._boundForceUpdate, this);
  },
  componentWillUnmount: function () {
    this.props.rooms.off('add change remove', this._boundForceUpdate);
  },
  joinRoomHandler: function () {
    this.channel.publish('Room.Join', {roomName: ReactDOM.findDOMNode(this.refs.roomName).value});
  },
  render: function () {
    return (
      <div class="col-sm-8 col-sm-offset-2">
        <h2>Please select the room</h2>
        <input type="text" placeholder="Room Name" class="form-control" ref="roomName" />
        <button class="btn btn-primary btn-block top-margin" onClick={this.joinRoomHandler}>
          Join Room
        </button>
        <ul>
        {this.props.rooms.map(function (r, i) {
          return (<li key={i} class="list-unstyled">
            <a href={'#room/' + r.get('id')}>{r.get('id')}</a>
          </li>);
        })}
        </ul>
      </div>
    );
  }
});
