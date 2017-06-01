import React from 'react';
import {UserView} from './user';

export let UserList = React.createClass({
  render: function() {
    let me = this.props.me;
    return (
      <ul className="list-unstyled">
      {this.props.collection.map(function(user, i) {
        if (me.id !== user.get('id')) {
          return (
            <li key={i}>
              <UserView user={user} size={50} useName={true} />
            </li>
          );          
        }
      })
      }
      </ul>
    );
  }
});
