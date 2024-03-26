export default () => ({
  nodeEnv: process.env.NODE_ENV,
  secret_key: process.env.SECRET_KEY,
  db: {
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_SECRET,
    dbname: process.env.DB_NAME,
  },
  web3:
  {
    provider: process.env.WEB3_PROVIDER,
    private_key: process.env.PRIVATE_KEY,
    public_key: process.env.PUBLIC_KEY,
  },
  contract: {
    token: process.env.TOKEN_CONTRACT,
    registration: process.env.REGISTRATION_CONTRACT
  },  
  email_host: process.env.EMAIL_HOST,
  email_port: process.env.EMAIL_PORT,
  email_secured: process.env.EMAIL_SECURE == "true" ? true : false,
  email_user: process.env.EMAIL_USER,
  email_password: process.env.EMAIL_PASSWORD,
  email_from: process.env.DEFAULT_EMAIL_FROM,
  app_name: process.env.APP_NAME,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN
  },
  otpExpiryTime: process.env.OTP_EXPIRY_TIME,
  file_size_limit: process.env.FILE_SIZE_LIMIT || 10,
  image_url: process.env.IMAGE_URL
});
