import React from 'react';
import {UserView} from './user';
import moment from 'moment';

export let ChatMessage = React.createClass({
  render: function(){
    let pull;
    if (this.props.me.id === this.props.chat.get('user').id){
      pull = 'pull-right';
    } else {
      pull = 'pull-left';
    }
    let timeAgo = moment(this.props.chat.get('ts')).fromNow();
    return (
      <li>
        <div className={"bg-primary chat-message " + pull}>
          {this.props.chat.get('message')}
        </div>
        <div className="clearfix" />
        <div className={pull}>
          <UserView user={this.props.chat.get('user')} size={20} useName={true}>
            <small>{timeAgo}</small>
          </UserView>
        </div>
        <div className="clearfix" />
      </li>
    );
  }
});
