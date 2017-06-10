const React = require("react");
const Layout = require("./layout");
const Form = require("./components/Form");

module.exports = ({ title, user, routes, message, token }) => (
  <Layout title={title} user={user} routes={routes}>
    <div className="row">
      <div className="col-sm-8 col-sm-offset-2">
        <div className="row">
          <div className="col-sm-12">
            <Form
              button={{ title: "Register" }}
              message={message}
              token={token}
            />
          </div>
        </div>
      </div>
    </div>
  </Layout>
);
