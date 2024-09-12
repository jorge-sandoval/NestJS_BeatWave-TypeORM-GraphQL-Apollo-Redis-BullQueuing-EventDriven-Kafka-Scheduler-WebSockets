import * as dotenv from 'dotenv';

dotenv.config();

export const jwtOptions = {
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
};
