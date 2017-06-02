import React from "react";

export default ({ size, user }) => (
  <div className="row">
    <img
      src={user.image(size)}
      className="img-circle"
      title={user.get("user")}
    />
    <span>{user.get("user")}</span>
  </div>
);
