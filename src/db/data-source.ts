import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { entities } from '@entities/index';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mssql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  options: {
    trustServerCertificate: true,
    encrypt: false,
  },
  entities:
    process.env.ENVIRONMENT === 'production'
      ? ['dist/**/*entity.js']
      : entities,
  migrations: ['dist/db/migrations/*.js'],
  synchronize: false,
};

export const dataSource = new DataSource(dataSourceOptions);
