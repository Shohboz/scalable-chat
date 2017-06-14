const React = require("react");
const Layout = require("./layout");

module.exports = ({ assets, title, user, routes, message }) => (
  <Layout title={title} user={user} routes={routes}>
    <div id="react-root" />
    {/*"include ./prepared/footer.pug"*/}
    <script src={"/static/vendor.js"} />
    <script src={`/static/${assets.js}`} />
  </Layout>
);
