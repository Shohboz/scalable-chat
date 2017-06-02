import React from "react";
import UserView from "./User";

export default ({ collection, me }) => (
  <ul className="list-unstyled">
    {collection.map((user, idx) => {
      if (me.id !== user.get("id")) {
        return (
          <li key={idx}>
            <UserView user={user} size={50} useName={true} />
          </li>
        );
      }
    })}
  </ul>
);
