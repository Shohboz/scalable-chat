import React from 'react';

export let UserView = React.createClass({
  render: function(){
    let name = this.props.useName ? this.props.user.get('user') : null;
    return (
      <div class="row">
        <img src={this.props.user.image(this.props.size)} class="img-circle" title={this.props.user.get('user')} />
        <span>{this.props.user.get('user')}</span>
      </div>
    );
  }
});