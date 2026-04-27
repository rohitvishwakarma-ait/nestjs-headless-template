// Central config loader — always use ConfigService, never process.env directly
export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
});
