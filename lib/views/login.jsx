const React = require("react");
const Layout = require("./layout");
const Form = require("./components/Form");

module.exports = ({ title, user, routes, message, token }) => (
  <Layout title={title} user={user} routes={routes}>
    <div className="row">
      <div className="col-sm-8 col-sm-offset-2">
        <div className="row">
          <div className="col-sm-12">
            <Form button={{ title: "Login" }} message={message} token={token} />
          </div>
        </div>
        <div className="row top-margin">
          <div className="col-sm-6">
            <a href={routes.facebookAuth} className="btn btn-block facebook">
              <i className="fa fa-facebook">
                Facebook
              </i>
            </a>
          </div>
          <div className="col-sm-6">
            <a href={routes.googleAuth} className="btn btn-block google">
              <i className="fa fa-google-plus">
                Google
              </i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </Layout>
);
