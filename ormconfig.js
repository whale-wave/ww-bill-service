const {
  ORM_TYPE = 'postgres',
  ORM_HOST = 'localhost',
  ORM_PORT = '5432',
  ORM_USERNAME = 'root',
  ORM_PASSWORD = '',
  ORM_DATABASE = 'development',
  ORM_SYNCHRONIZE = 'false',
  ORM_TIMEZONE = '+08:00',
} = process.env;

module.exports = [
  {
    type: ORM_TYPE,
    host: ORM_HOST,
    port: isNaN(Number(ORM_PORT)) ? '5432' : Number(ORM_PORT),
    username: ORM_USERNAME,
    password: ORM_PASSWORD,
    database: ORM_DATABASE,
    synchronize: ORM_SYNCHRONIZE === 'true',
    timezone: ORM_TIMEZONE,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.ts,.js}'],
    cli: {
      migrationsDir: './src/migrations',
    },
  },
];
