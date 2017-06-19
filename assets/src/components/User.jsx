import React, { Component } from "react";

const UserView = ({ size, user, name }) => (
  <div className="row">
    <img
      src={user.image(size)}
      className="img-circle"
      title={user.get("user")}
    />
    <span>{name}</span>
  </div>
);

export default class extends Component {
  render() {
    const { size, useName, user } = this.props;
    let name = useName ? user.get("user") : null;
    return <UserView name={name} size={size} user={user} />;
  }
}
