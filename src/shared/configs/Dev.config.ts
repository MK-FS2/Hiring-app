export const DevConfigs = () => (
{
  port:process.env.PORT,

  database: 
  {
    url: process.env.DB_URL,
  },

  cloud: 
  {
    name: process.env.CLOUD_NAME,
    apiKey: process.env.CLOUD_API_KEY,
    secret: process.env.CLOUD_SECRET,
  },

  email: 
  {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  encryption: 
  {
    key: process.env.ENCRYPTION_KEY,
  },

  tokens: 
  {
    access: process.env.ACCESS_TOKEN_SECRET,
    refresh: process.env.REFRESH_TOKEN_SECRET,
  },

  google: 
  {
    clientId: process.env.GOOGLE_CLIENT_ID,
  },
});
