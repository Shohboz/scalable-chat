const React = require("react");

module.exports = ({ routes: { login, register } }) => (
  <div>
    <a href={login}>
      Login
    </a>
    {" or "}
    <a href={register}>
      Register
    </a>
  </div>
);
