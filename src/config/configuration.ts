export default () => ({
  port: parseInt(process.env.PORT, 10) || 5000,
  database: {
    name: process.env.POSTGRES_DB || 'postgres',
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRESS_PASSWORD || 'postgres',
    host: process.env.POSTGRES_HOST || 'db',
    port: parseInt(process.env.POSTGRESS_PORT, 10) || 5432,
  },
  auth: {
    secret: process.env.SECRET_KEY || 'secret_key',
    expires: process.env.JWT_EXPIRES || '24h',
  },
});
