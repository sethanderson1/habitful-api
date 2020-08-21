module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://dunder_mifflin:p@localhost/habitful',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://dunder_mifflin:p@localhost/habitful-test',
  CLIENT_ORIGIN: process.env.NODE_ENV === 'production'
    ? process.env.CLIENT_ORIGIN
    : 3000,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'secret',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'refresh-secret',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '1d'
};