import axios from 'axios';
import { v4 as uuid } from 'uuid';
import {
  UnsuccessfulResponse,
  PaparaValidateUserResponse,
  PaparaMasspaymentResponse,
  PaparaMasspaymentVerificationResponse,
  UserValidation,
  Masspayment,
  MasspaymentVerification,
} from './interfaces';

export default class Papara {
  private get BASE_URL() {
    if (this.test) {
      return 'https://merchant.test.api.papara.com';
    } else {
      return 'https://merchant-api.papara.com';
    }
  }

  constructor(API_KEY: string, private test = false) {
    axios.interceptors.request.use((req) => {
      req.headers.ApiKey = API_KEY;
      return req;
    });
  }

  // This is a base function for verificateUserBy... methods
  private async verificateUser(
    method: 'accountNumber' | 'email' | 'phoneNumber' | 'tckn',
    credential: string,
  ): Promise<UserValidation | UnsuccessfulResponse> {
    try {
      const response = await axios.get<PaparaValidateUserResponse>(
        `${this.BASE_URL}/validation/${method}?${method}=${credential}`,
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  async verificateUserByAccountNumber(accountNumber: string) {
    return await this.verificateUser('accountNumber', accountNumber);
  }
  async verificateUserByEmail(email: string) {
    return this.verificateUser('email', email);
  }
  async verificateUserByPhoneNumber(phoneNumber: string) {
    return this.verificateUser('phoneNumber', phoneNumber);
  }
  async verificateUserByTCKN(tckn: string) {
    return this.verificateUser('tckn', tckn);
  }

  private async masspayment(
    method: 'accountNumber' | 'email' | 'phoneNumber',
    credential: string,
    amount: number,
    turkishNationalId?: string,
  ): Promise<Masspayment | UnsuccessfulResponse> {
    const subPath = method === 'accountNumber' ? '' : method === 'phoneNumber' ? 'phone' : 'email';
    const requestObj = {
      massPaymentId: uuid(),
      [method]: credential,
      amount,
      turkishNationalId,
    };
    const url = `${this.BASE_URL}/masspayment/${subPath}`;

    try {
      const response = await axios.post<PaparaMasspaymentResponse>(url, requestObj);
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  async masspaymentByAccountNumber(accountNumber: string, amount: number, turkishNationalId?: string) {
    return this.masspayment('accountNumber', accountNumber, amount, turkishNationalId);
  }
  async masspaymentByEmail(email: string, amount: number, turkishNationalId?: string) {
    return this.masspayment('email', email, amount, turkishNationalId);
  }
  async masspaymentByPhone(phoneNumber: string, amount: number, turkishNationalId?: string) {
    return this.masspayment('phoneNumber', phoneNumber, amount, turkishNationalId);
  }

  private async masspaymentVerification(
    method: 'id' | 'masspaymentId',
    credential: string,
  ): Promise<MasspaymentVerification | UnsuccessfulResponse> {
    try {
      const queryParam = `${method === 'id' ? 'id' : 'byreference'}=${credential}`;
      const response = await axios.get<PaparaMasspaymentVerificationResponse>(
        `${this.BASE_URL}/masspayment${queryParam}`,
      );

      return response.data;
    } catch (err) {
      throw err;
    }
  }

  async masspaymentVerficationById(id: string) {
    return this.masspaymentVerification('id', id);
  }
  async masspaymentVerficationByMasspaymentId(masspaymentId: string) {
    return this.masspaymentVerification('masspaymentId', masspaymentId);
  }
}
