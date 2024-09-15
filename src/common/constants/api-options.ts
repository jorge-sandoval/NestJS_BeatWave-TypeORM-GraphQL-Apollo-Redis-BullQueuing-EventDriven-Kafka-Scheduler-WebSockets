import { APIOptions } from '@common/interfaces/api-options.interface';
import * as dotenv from 'dotenv';

dotenv.config();

export const apiOptions: APIOptions = {
  baseUrl: process.env.DB_HOST,
};
