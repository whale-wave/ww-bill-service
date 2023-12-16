const {
  // development
  ORM_DEVELOPMENT_TYPE = 'postgres',
  ORM_DEVELOPMENT_HOST = 'localhost',
  ORM_DEVELOPMENT_PORT = '5432',
  ORM_DEVELOPMENT_USERNAME = 'root',
  ORM_DEVELOPMENT_PASSWORD = '',
  ORM_DEVELOPMENT_DATABASE = 'development',
  ORM_DEVELOPMENT_SYNCHRONIZE = 'false',
  ORM_DEVELOPMENT_TIMEZONE = '+08:00',
  // production
  ORM_PRODUCTION_TYPE = 'postgres',
  ORM_PRODUCTION_HOST = 'localhost',
  ORM_PRODUCTION_PORT = '5432',
  ORM_PRODUCTION_USERNAME = 'root',
  ORM_PRODUCTION_PASSWORD = '',
  ORM_PRODUCTION_DATABASE = 'production',
  ORM_PRODUCTION_SYNCHRONIZE = 'false',
  ORM_PRODUCTION_TIMEZONE = '+08:00',
} = process.env;

module.exports = {
  development: {
    type: ORM_DEVELOPMENT_TYPE,
    host: ORM_DEVELOPMENT_HOST,
    port: isNaN(Number(ORM_DEVELOPMENT_PORT))
      ? '5432'
      : Number(ORM_DEVELOPMENT_PORT),
    username: ORM_DEVELOPMENT_USERNAME,
    password: ORM_DEVELOPMENT_PASSWORD,
    database: ORM_DEVELOPMENT_DATABASE,
    synchronize: ORM_DEVELOPMENT_SYNCHRONIZE === 'true',
    timezone: ORM_DEVELOPMENT_TIMEZONE,
  },
  test: {
    type: 'mysql',
    host: '',
    port: 3306,
    username: 'root',
    password: '',
    database: '',
    synchronize: false,
    timezone: '+08:00',
  },
  production: {
    type: ORM_PRODUCTION_TYPE,
    host: ORM_PRODUCTION_HOST,
    port: isNaN(Number(ORM_PRODUCTION_PORT))
      ? '5432'
      : Number(ORM_PRODUCTION_PORT),
    username: ORM_PRODUCTION_USERNAME,
    password: ORM_PRODUCTION_PASSWORD,
    database: ORM_PRODUCTION_DATABASE,
    synchronize: ORM_PRODUCTION_SYNCHRONIZE === 'true',
    timezone: ORM_PRODUCTION_TIMEZONE,
  },
};
