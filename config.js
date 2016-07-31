module.exports = {
  port: process.env.PORT,
  secret: process.env.SECRET,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
  routes: {
    login: '/account/login',
    logout: '/account/logout',
    register: '/account/register',
    chat: '/chat',
    facebookAuth: '/auth/facebook',
    facebookAuthCallback: '/auth/facebook/callback',
    googleAuth: '/auth/google',
    googleAuthCallback: '/auth/google/callback'
  },
  facebook: {
    appID: process.env.FACEBOOK_APPID,
    appSecret: process.env.FACEBOOK_APPSECRET
  },
  google: {
    clientID: process.env.GOOGLE_APPID,
    clientSecret: process.env.GOOGLE_APPSECRET
  },
  crypto: {
    workFactor: 5000,
    keylen: 32,
    randomSize: 256
  }
};