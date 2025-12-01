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
    key: process.env.Encryptionkey,
  },

  tokens: 
  {
    access: process.env.AcessToken,
    refresh: process.env.RefreshToken,
  },

  google: 
  {
    clientId: process.env.ClientKey,
  },
});
