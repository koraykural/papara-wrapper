import axios from 'axios';
// import * as AxiosLogger from 'axios-logger'; // For debugging
import { v4 as uuid } from 'uuid';
import {
  PaparaResponse,
  AccountData,
  PaymentsData,
  ValidationData,
  MasspaymentData,
  MasspaymentVerificationData,
  AccountLedgersData,
  SettlementData,
  BankAccountsData,
  CashdepositData,
  CashdepositProvisionData,
} from './interfaces';

export default class Papara {
  private get BASE_URL() {
    if (this.testEnv) {
      return 'https://merchant.test.api.papara.com';
    } else {
      return 'https://merchant-api.papara.com';
    }
  }
  private testEnv: boolean;

  /**
   * Creates an instance of papara.
   * @param { API_KEY, testEnv = false }
   */
  constructor({ API_KEY, testEnv = false }: { API_KEY: string; testEnv?: boolean }) {
    this.testEnv = testEnv;

    axios.interceptors.request.use((req) => {
      req.headers.ApiKey = API_KEY;
      return req;
    });

    // // Debug interceptors
    // axios.interceptors.response.use((res) => AxiosLogger.responseLogger(res));
    // axios.interceptors.request.use((req) => AxiosLogger.requestLogger(req));
  }

  /**
   * Returns information about the account associated with the API_KEY.
   *
   * @returns  Account information.
   */
  async account() {
    try {
      const response = await axios.get<PaparaResponse<AccountData>>(`${this.BASE_URL}/account`);
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Accounts ledgers
   *
   * @param {
   *     startDate,
   *     endDate,
   *     page,
   *     pageSize,
   *     entryType,
   *     accountNumber,
   *   }
   * @returns ledgers
   */
  async accountLedgers({
    startDate,
    endDate,
    page,
    pageSize,
    entryType,
    accountNumber,
  }: {
    startDate: string;
    endDate: string;
    page: number;
    pageSize: number;
    entryType?: number | string;
    accountNumber?: number;
  }): Promise<PaparaResponse<AccountLedgersData>> {
    try {
      const requestBody = {
        ...(entryType !== undefined ? { entryType } : {}),
        ...(accountNumber !== undefined ? { accountNumber } : {}),
        startDate,
        endDate,
        page,
        pageSize,
      };
      const response = await axios.post<PaparaResponse<AccountLedgersData>>(
        `${this.BASE_URL}/account/ledgers`,
        requestBody,
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Accounts settlement
   * @param {
   *     startDate,
   *     endDate,
   *     entryType,
   *   }
   * @returns settlement
   */
  async accountSettlement({
    startDate,
    endDate,
    entryType,
  }: {
    startDate: string;
    endDate: string;
    entryType?: number | string;
  }): Promise<PaparaResponse<SettlementData>> {
    try {
      const requestBody = {
        ...(entryType !== undefined ? { entryType } : {}),
        startDate,
        endDate,
      };
      const response = await axios.post<PaparaResponse<SettlementData>>(
        `${this.BASE_URL}/account/settlement`,
        requestBody,
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Payments papara
   * @param {
   *     amount,
   *     referenceId,
   *     orderDescription,
   *     notificationUrl,
   *     redirectUrl,
   *     turkishNationalId,
   *   }
   * @returns
   */
  async payments({
    amount,
    referenceId,
    orderDescription,
    notificationUrl,
    redirectUrl,
    turkishNationalId,
  }: {
    amount: number;
    referenceId?: string;
    orderDescription: string;
    notificationUrl: string;
    redirectUrl: string;
    turkishNationalId?: string;
  }) {
    const requestBody = {
      ...(referenceId !== undefined ? { referenceId } : { referenceId: uuid() }),
      ...(turkishNationalId !== undefined ? { turkishNationalId } : {}),
      amount,
      orderDescription,
      notificationUrl,
      redirectUrl,
    };
    try {
      const response = await axios.post<PaparaResponse<PaymentsData>>(`${this.BASE_URL}/payments`, requestBody);
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Payments validation
   * @param id
   * @returns
   */
  async paymentsValidation(id: string) {
    try {
      const response = await axios.get<PaparaResponse<PaymentsData>>(`${this.BASE_URL}/payments?id=${id}`);
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Payments refund
   * @param id
   * @returns
   */
  async paymentsRefund(id: string) {
    try {
      const response = await axios.put<PaparaResponse<any>>(`${this.BASE_URL}/payments?id=${id}`);
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  // This is a base method for validationBy... methods
  private async validation(method: 'accountNumber' | 'email' | 'phoneNumber' | 'tckn', credential: string | number) {
    try {
      const response = await axios.get<PaparaResponse<ValidationData>>(
        `${this.BASE_URL}/validation/${method}?${method}=${credential}`,
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Validations by account number
   * @param accountNumber
   * @returns
   */
  async validationByAccountNumber(accountNumber: number) {
    return this.validation('accountNumber', accountNumber);
  }

  /**
   * Validations by email
   * @param email
   * @returns
   */
  async validationByEmail(email: string) {
    return this.validation('email', email);
  }

  /**
   * Validations by phone number
   * @param phoneNumber
   * @returns
   */
  async validationByPhoneNumber(phoneNumber: string) {
    return this.validation('phoneNumber', phoneNumber);
  }

  /**
   * Validations by tckn
   * @param tckn
   * @returns
   */
  async validationByTCKN(tckn: string) {
    return this.validation('tckn', tckn);
  }

  // This is a base method for masspaymentBy... methods
  private async masspayment({
    method,
    credential,
    amount,
    turkishNationalId,
    massPaymentId,
  }: {
    method: 'accountNumber' | 'email' | 'phoneNumber';
    credential: string | number;
    amount: number;
    turkishNationalId?: string;
    massPaymentId?: string;
  }) {
    const subPath = method === 'accountNumber' ? '' : method === 'phoneNumber' ? 'phone' : 'email';
    const requestBody = {
      ...(turkishNationalId !== undefined ? { turkishNationalId } : {}),
      ...(massPaymentId !== undefined ? { massPaymentId } : { massPaymentId: uuid() }),
      [method]: credential,
      amount,
    };
    const url = `${this.BASE_URL}/masspayment/${subPath}`;

    try {
      const response = await axios.post<PaparaResponse<MasspaymentData>>(url, requestBody);
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Masspayments by account number
   * @param {
   *     accountNumber,
   *     amount,
   *     turkishNationalId,
   *     massPaymentId,
   *   }
   * @returns
   */
  async masspaymentByAccountNumber({
    accountNumber,
    amount,
    turkishNationalId,
    massPaymentId,
  }: {
    accountNumber: number;
    amount: number;
    turkishNationalId?: string;
    massPaymentId?: string;
  }) {
    return this.masspayment({
      method: 'accountNumber',
      credential: accountNumber,
      amount,
      turkishNationalId,
      massPaymentId,
    });
  }

  /**
   * Masspayments by email
   * @param {
   *     email,
   *     amount,
   *     turkishNationalId,
   *     massPaymentId,
   *   }
   * @returns
   */
  async masspaymentByEmail({
    email,
    amount,
    turkishNationalId,
    massPaymentId,
  }: {
    email: string;
    amount: number;
    turkishNationalId?: string;
    massPaymentId?: string;
  }) {
    return this.masspayment({
      method: 'email',
      credential: email,
      amount,
      turkishNationalId,
      massPaymentId,
    });
  }

  /**
   * Masspayments by phone
   * @param {
   *     phoneNumber,
   *     amount,
   *     turkishNationalId,
   *     massPaymentId,
   *   }
   * @returns
   */
  async masspaymentByPhone({
    phoneNumber,
    amount,
    turkishNationalId,
    massPaymentId,
  }: {
    phoneNumber: string;
    amount: number;
    turkishNationalId?: string;
    massPaymentId?: string;
  }) {
    return this.masspayment({
      method: 'phoneNumber',
      credential: phoneNumber,
      amount,
      turkishNationalId,
      massPaymentId,
    });
  }

  // This is a base method for masspaymentVerificationBy... methods
  private async masspaymentVerification(method: 'id' | 'masspaymentId', credential: string) {
    try {
      const queryParam = `${method === 'id' ? 'id' : 'byreference'}=${credential}`;
      const response = await axios.get<PaparaResponse<MasspaymentVerificationData>>(
        `${this.BASE_URL}/masspayment${queryParam}`,
      );

      return response.data;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Masspayments verfication by id
   * @param id
   * @returns
   */
  async masspaymentVerficationById(id: string) {
    return this.masspaymentVerification('id', id);
  }

  /**
   * Masspayments verfication by masspayment id
   * @param masspaymentId
   * @returns
   */
  async masspaymentVerficationByMasspaymentId(masspaymentId: string) {
    return this.masspaymentVerification('masspaymentId', masspaymentId);
  }

  private async cashDeposit({
    method,
    credential,
    amount,
    merchantReference,
  }: {
    method: 'phoneNumber' | 'accountnumber' | 'tckn';
    credential: string | number;
    amount: number;
    merchantReference?: string;
  }) {
    try {
      const subPath = method === 'phoneNumber' ? '' : method;

      const requestBody = {
        ...(merchantReference !== undefined ? { merchantReference } : { merchantReference: uuid() }),
        amount,
        [method]: credential,
      };
      const response = await axios.post<PaparaResponse<CashdepositData>>(
        `${this.BASE_URL}/cashdeposit/${subPath}`,
        requestBody,
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Cashs deposit by phone number
   * @param phoneNumber
   * @param amount
   * @param [merchantReference]
   * @returns
   */
  async cashDepositByPhoneNumber(phoneNumber: string, amount: number, merchantReference?: string) {
    return this.cashDeposit({ method: 'phoneNumber', credential: phoneNumber, amount, merchantReference });
  }

  /**
   * Cashs deposit by account number
   * @param accountNumber
   * @param amount
   * @param [merchantReference]
   * @returns
   */
  async cashDepositByAccountNumber(accountNumber: number, amount: number, merchantReference?: string) {
    return this.cashDeposit({ method: 'accountnumber', credential: accountNumber, amount, merchantReference });
  }

  /**
   * Cashs deposit by tckn
   * @param tckn
   * @param amount
   * @param [merchantReference]
   * @returns
   */
  async cashDepositByTCKN(tckn: string, amount: number, merchantReference?: string) {
    return this.cashDeposit({ method: 'tckn', credential: tckn, amount, merchantReference });
  }

  /**
   * Cashs deposit settlement
   * @param StartDate
   * @param EndDate
   * @returns
   */
  async cashDepositSettlement(StartDate: string, EndDate: string) {
    try {
      const response = await axios.post<PaparaResponse<SettlementData>>(`${this.BASE_URL}/cashdeposit/settlement`, {
        StartDate,
        EndDate,
      });
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  private async cashDepositProvision({
    method,
    credential,
    amount,
    merchantReference,
  }: {
    method: 'phoneNumber' | 'tckn' | 'accountNumber';
    credential: string | number;
    amount: number;
    merchantReference?: string;
  }) {
    try {
      const subPath = `provision/${method.toLowerCase()}`;

      const requestBody = {
        ...(merchantReference !== undefined ? { merchantReference } : { merchantReference: uuid() }),
        amount,
        [method]: credential,
      };
      const response = await axios.post<PaparaResponse<CashdepositProvisionData>>(
        `${this.BASE_URL}/cashdeposit/${subPath}`,
        requestBody,
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Cashs deposit provision by phone number
   * @param phoneNumber
   * @param amount
   * @param [merchantReference]
   * @returns
   */
  async cashDepositProvisionByPhoneNumber(phoneNumber: string, amount: number, merchantReference?: string) {
    return this.cashDepositProvision({
      method: 'phoneNumber',
      credential: phoneNumber,
      amount,
      merchantReference,
    });
  }

  /**
   * Cashs deposit provision by account number
   * @param accountNumber
   * @param amount
   * @param [merchantReference]
   * @returns
   */
  async cashDepositProvisionByAccountNumber(accountNumber: number, amount: number, merchantReference?: string) {
    return this.cashDepositProvision({
      method: 'accountNumber',
      credential: accountNumber,
      amount,
      merchantReference,
    });
  }

  /**
   * Cashs deposit provision by tckn
   * @param tckn
   * @param amount
   * @param [merchantReference]
   * @returns
   */
  async cashDepositProvisionByTCKN(tckn: string, amount: number, merchantReference?: string) {
    return this.cashDepositProvision({
      method: 'tckn',
      credential: tckn,
      amount,
      merchantReference,
    });
  }

  /**
   * Cashs deposit provision complete
   * @param Id
   * @param TransactionDate
   * @returns
   */
  async cashDepositProvisionComplete(Id: number, TransactionDate: string) {
    try {
      const requestBody = { Id, TransactionDate };
      const response = await axios.post<PaparaResponse<CashdepositData>>(
        `${this.BASE_URL}/cashdeposit/provision/complete`,
        requestBody,
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Cashs deposit provision settlement
   * @param StartDate
   * @param EndDate
   * @returns
   */
  async cashDepositProvisionSettlement(StartDate: string, EndDate: string) {
    try {
      const response = await axios.post<PaparaResponse<SettlementData>>(
        `${this.BASE_URL}/cashdeposit/provision/settlement`,
        {
          StartDate,
          EndDate,
        },
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  private async cashDepositVerification(method: 'id' | 'merchantReference', credential: string | number) {
    try {
      const url =
        method === 'id'
          ? `${this.BASE_URL}/cashdeposit?id=${credential}`
          : `${this.BASE_URL}/cashdeposit/byreference?reference=${credential}`;
      const response = await axios.get<PaparaResponse<CashdepositData>>(url);
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Cashs deposit verification by id
   * @param id
   * @returns
   */
  async cashDepositVerificationById(id: number) {
    return this.cashDepositVerification('id', id);
  }

  /**
   * Cashs deposit verification by merchant reference
   * @param merchantReference
   * @returns
   */
  async cashDepositVerificationByMerchantReference(merchantReference: string) {
    return this.cashDepositVerification('merchantReference', merchantReference);
  }

  /**
   * Cashs deposit verification by date
   * @param StartDate
   * @param EndDate
   * @param PageIndex
   * @param PageItemCount
   * @returns
   */
  async cashDepositVerificationByDate(StartDate: string, EndDate: string, PageIndex: number, PageItemCount: number) {
    try {
      const params = {
        StartDate,
        EndDate,
        PageIndex,
        PageItemCount,
      };
      const response = await axios.get<PaparaResponse<CashdepositData[]>>(`${this.BASE_URL}/cashdeposit/bydate`, {
        params,
      });
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Banks accounts
   * @returns
   */
  async bankAccounts() {
    try {
      const response = await axios.get<PaparaResponse<BankAccountsData[]>>(`${this.BASE_URL}/banking/bankaccounts`);
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Banks withdrawal
   * @param { bankAccountId, amount }
   * @returns
   */
  async bankWithdrawal({ bankAccountId, amount }: { bankAccountId: number; amount: number }) {
    try {
      const requestBody = { amount, bankAccountId };
      const response = await axios.post<PaparaResponse<undefined>>(`${this.BASE_URL}/banking/withdrawal`, requestBody);
      return response.data;
    } catch (err) {
      throw err;
    }
  }
}
