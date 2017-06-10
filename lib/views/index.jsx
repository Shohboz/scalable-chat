const React = require("react");
const Layout = require("./layout");

module.exports = ({ title, user, routes }) => (
  <Layout title={title} user={user} routes={routes}>
    <h1>{title}</h1>
    <p>
      Welcome to {title}
    </p>
  </Layout>
);
