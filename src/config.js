module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://dunder_mifflin:p@localhost/habits',
  // // DATABASE_URL: process.env.HEROKU_POSTGRESQL_CHARCOAL_URL || 'postgres://thxssckzajzwrf:919528876fb18bea24896bc9fd87a05df4394f6b3ceaa231a5a9f5363701ec58@ec2-52-202-146-43.compute-1.amazonaws.com:5432/dftsu3tneaih6q',
  // // DATABASE_URL: process.env.DATABASE_URL || 'postgres://thxssckzajzwrf:919528876fb18bea24896bc9fd87a05df4394f6b3ceaa231a5a9f5363701ec58@ec2-52-202-146-43.compute-1.amazonaws.com:5432/dftsu3tneaih6q',
  // TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://dunder_mifflin:p@localhost/recipe-repo-test',
  CLIENT_ORIGIN: process.env.NODE_ENV === 'production'
    ? process.env.CLIENT_ORIGIN
    : 3000,
  // // CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 3000,
  // ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'secret',
  // REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'refresh-secret',
  // JWT_EXPIRY: process.env.JWT_EXPIRY || '1h'
};