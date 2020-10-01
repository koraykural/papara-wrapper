import * as dotenv from 'dotenv';
dotenv.config();

import Papara from '../index';
import { AxiosRequestConfig } from 'axios';

const papara = new Papara('API_KEY', false);

let DATA: any = null;

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: DATA })),
  post: jest.fn(() => Promise.resolve({ data: DATA })),
  interceptors: {
    request: {
      use: (req: AxiosRequestConfig) => {
        return req;
      },
    },
  },
}));

it('User Validation', async () => {
  DATA = { succeeded: true };
  const response = await papara.verificateUserByAccountNumber('USER_ID');
  console.log(response);

  expect(response.succeeded).toBe(true);
});

it('Masspayment', async () => {
  DATA = { succeeded: true };
  const response = await papara.masspaymentByAccountNumber('USER_ID', 10);
  console.log(response);

  expect(response.succeeded).toBe(true);
});
