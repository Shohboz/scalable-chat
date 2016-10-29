import {findDOMNode} from 'react-dom';
import {UserView} from './user';
import postal from 'postal';
import React from 'react';

export let ChatForm = React.createClass({
  componentWillMount: function() {
    this.channel = postal.channel();
  },
  formSubmit: function(e) {
    e.preventDefault();
    let message = findDOMNode(this.refs.message).value;
    if (message !== '') {
      this.channel.publish('Chat.Add', {message: message})
      findDOMNode(this.refs.message).value = '';
      findDOMNode(this.refs.message).placeholder = '';
    } else {
      findDOMNode(this.refs.message).placeholder = 'Please enter a message';
    }
  },
  render: function() {
    return (
      <div className="row">
        <form onSubmit={this.formSubmit}>
          <div className="col-sm-2">
            <UserView user={this.props.me} size={50} useName={true} />
          </div>
          <div className="col-sm-8">
            <input type="text" className="form-control" ref="message" />
          </div>
          <div className="col-sm-2">
            <button className="btn btn-primary">Send</button>
          </div>
        </form>
      </div>
    );
  }
});