// to orgianzie the config for database, it is gathered here then exported as one object
const mysqlConfig = {
  MYSQL_USERNAME: process.env.MYSQL_USERNAME,
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
  MYSQL_DB_NAME: process.env.MYSQL_DB_NAME,
};

module.exports = mysqlConfig;
