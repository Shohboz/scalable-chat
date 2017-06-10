const React = require("react");

module.exports = ({ user, routes: { logout } }) => (
  <div>
    Hello {user && user.displayName}
    <a href={logout}>
      Logout
    </a>
  </div>
);
