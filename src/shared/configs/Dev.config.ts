export const DevConfigs = () => (
{
  port:process.env.PORT,

  database: 
  {
    url: process.env.DB_URL,
  },

  cloud: 
  {
    name: process.env.CloudName,
    apiKey: process.env.CloudApiKey,
    secret: process.env.CloudSecret,
  },

  email: 
  {
    user: process.env.EMAILUSER,
    pass: process.env.EMAILPASS,
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
