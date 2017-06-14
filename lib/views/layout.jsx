const React = require("react");
const UserLoggedIn = require("./components/UserLoggedIn");
const UserLoggedOut = require("./components/UserLoggedOut");

module.exports = ({ routes, user, title, children, isAuthenticated }) => (
  <html>
    <head>
      <title>
        {title}
      </title>
      <script src={"/static/vendor.js"} />
    </head>
    <body>
      <div className="container">
        <div className="row">
          <div className="col-sm-4">
            <h1>
              Chat
            </h1>
          </div>
          <div className="col-sm-4 col-sm-offset-4 top-margin">
            <div className="pull-right">
              {isAuthenticated
                ? <UserLoggedIn routes={routes} user={user} />
                : <UserLoggedOut routes={routes} />}
            </div>
          </div>
        </div>
        <div className="row">
          {children}
        </div>
      </div>
    </body>
  </html>
);
