const React = require("react");

module.exports = ({ button: { title }, message, token }) => (
  <form method="post">
    {!!message.length &&
      <div className="alert alert-danger">
        {message}
      </div>}
    <input type="hidden" name="_csrf" value={token} />
    <div className="form-group">
      <label htmlFor="username">
        Username
      </label>
      <input
        type="text"
        className="form-control"
        id="username"
        placeholder="username"
        name="username"
      />
    </div>
    <div className="form-group">
      <label htmlFor="password">
        Password
      </label>
      <input
        type="password"
        className="form-control"
        id="password"
        placeholder="password"
        name="password"
      />
    </div>
    <button className="btn btn-primary btn-block">
      {title}
    </button>
  </form>
);
