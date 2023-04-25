export default () => ({
  nodeEnv: process.env.NODE_ENV,
  port: Number(process.env.PORT),
  databaseUrl: process.env.DATABASE_URL,
});
