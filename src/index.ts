import PaparaHttp from './papara-http';
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
  private http: PaparaHttp;

  /**
   * Creates an instance of papara.
   * @param { API_KEY, testEnv = false }
   */
  constructor({ API_KEY, testEnv = false, debug = false }: { API_KEY: string; testEnv?: boolean; debug?: boolean }) {
    this.http = new PaparaHttp({ API_KEY, testEnv, debug });
  }

  /**
   * Returns information about the account associated with the API_KEY.
   *
   * @returns  Account information.
   */
  async account(): Promise<PaparaResponse<AccountData>> {
    try {
      return await this.http.get<AccountData>(`account`);
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
      return await this.http.post<AccountLedgersData>(`/account/ledgers`, requestBody);
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
      return await this.http.post<SettlementData>(`/account/settlement`, requestBody);
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
  }): Promise<PaparaResponse<PaymentsData>> {
    const requestBody = {
      ...(referenceId !== undefined ? { referenceId } : { referenceId: uuid() }),
      ...(turkishNationalId !== undefined ? { turkishNationalId } : {}),
      amount,
      orderDescription,
      notificationUrl,
      redirectUrl,
    };
    try {
      return await this.http.post<PaymentsData>(`/payments`, requestBody);
    } catch (err) {
      throw err;
    }
  }

  /**
   * Payments validation
   * @param id
   * @returns
   */
  async paymentsValidation(id: string): Promise<PaparaResponse<PaymentsData>> {
    try {
      return await this.http.get<PaymentsData>(`/payments?id=${id}`);
    } catch (err) {
      throw err;
    }
  }

  /**
   * Payments refund
   * @param id
   * @returns
   */
  async paymentsRefund(id: string): Promise<PaparaResponse<any>> {
    try {
      return this.http.put<PaparaResponse<any>>(`/payments?id=${id}`);
    } catch (err) {
      throw err;
    }
  }

  // This is a base method for validationBy... methods
  private async validation(method: 'accountNumber' | 'email' | 'phoneNumber' | 'tckn', credential: string | number) {
    try {
      const response = await this.http.get<ValidationData>(`/validation/${method}?${method}=${credential}`);
      return response;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Validations by account number
   * @param accountNumber
   * @returns
   */
  async validationByAccountNumber(accountNumber: number): Promise<PaparaResponse<ValidationData>> {
    return this.validation('accountNumber', accountNumber);
  }

  /**
   * Validations by email
   * @param email
   * @returns
   */
  async validationByEmail(email: string): Promise<PaparaResponse<ValidationData>> {
    return this.validation('email', email);
  }

  /**
   * Validations by phone number
   * @param phoneNumber
   * @returns
   */
  async validationByPhoneNumber(phoneNumber: string): Promise<PaparaResponse<ValidationData>> {
    return this.validation('phoneNumber', phoneNumber);
  }

  /**
   * Validations by tckn
   * @param tckn
   * @returns
   */
  async validationByTCKN(tckn: string): Promise<PaparaResponse<ValidationData>> {
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
  }): Promise<PaparaResponse<MasspaymentData>> {
    const subPath = method === 'accountNumber' ? '' : method === 'phoneNumber' ? 'phone' : 'email';
    const requestBody = {
      ...(turkishNationalId !== undefined ? { turkishNationalId } : {}),
      ...(massPaymentId !== undefined ? { massPaymentId } : { massPaymentId: uuid() }),
      [method]: credential,
      amount,
    };
    const url = `/masspayment/${subPath}`;

    try {
      return await this.http.post<MasspaymentData>(url, requestBody);
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
  }): Promise<PaparaResponse<MasspaymentData>> {
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
  }): Promise<PaparaResponse<MasspaymentData>> {
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
  }): Promise<PaparaResponse<MasspaymentData>> {
    return this.masspayment({
      method: 'phoneNumber',
      credential: phoneNumber,
      amount,
      turkishNationalId,
      massPaymentId,
    });
  }

  // This is a base method for masspaymentVerificationBy... methods
  private async masspaymentVerification(
    method: 'id' | 'masspaymentId',
    credential: string,
  ): Promise<PaparaResponse<MasspaymentVerificationData>> {
    try {
      const queryParam = `${method === 'id' ? 'id' : 'byreference'}=${credential}`;
      return await this.http.get<MasspaymentVerificationData>(`/masspayment${queryParam}`);
    } catch (err) {
      throw err;
    }
  }

  /**
   * Masspayments verfication by id
   * @param id
   * @returns
   */
  async masspaymentVerficationById(id: string): Promise<PaparaResponse<MasspaymentVerificationData>> {
    return this.masspaymentVerification('id', id);
  }

  /**
   * Masspayments verfication by masspayment id
   * @param masspaymentId
   * @returns
   */
  async masspaymentVerficationByMasspaymentId(
    masspaymentId: string,
  ): Promise<PaparaResponse<MasspaymentVerificationData>> {
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
  }): Promise<PaparaResponse<CashdepositData>> {
    try {
      const subPath = method === 'phoneNumber' ? '' : method;

      const requestBody = {
        ...(merchantReference !== undefined ? { merchantReference } : { merchantReference: uuid() }),
        amount,
        [method]: credential,
      };
      return await this.http.post<CashdepositData>(`/cashdeposit/${subPath}`, requestBody);
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
  async cashDepositByPhoneNumber(
    phoneNumber: string,
    amount: number,
    merchantReference?: string,
  ): Promise<PaparaResponse<CashdepositData>> {
    return this.cashDeposit({ method: 'phoneNumber', credential: phoneNumber, amount, merchantReference });
  }

  /**
   * Cashs deposit by account number
   * @param accountNumber
   * @param amount
   * @param [merchantReference]
   * @returns
   */
  async cashDepositByAccountNumber(
    accountNumber: number,
    amount: number,
    merchantReference?: string,
  ): Promise<PaparaResponse<CashdepositData>> {
    return this.cashDeposit({ method: 'accountnumber', credential: accountNumber, amount, merchantReference });
  }

  /**
   * Cashs deposit by tckn
   * @param tckn
   * @param amount
   * @param [merchantReference]
   * @returns
   */
  async cashDepositByTCKN(
    tckn: string,
    amount: number,
    merchantReference?: string,
  ): Promise<PaparaResponse<CashdepositData>> {
    return this.cashDeposit({ method: 'tckn', credential: tckn, amount, merchantReference });
  }

  /**
   * Cashs deposit settlement
   * @param StartDate
   * @param EndDate
   * @returns
   */
  async cashDepositSettlement(StartDate: string, EndDate: string): Promise<PaparaResponse<SettlementData>> {
    try {
      return await this.http.post<SettlementData>(`/cashdeposit/settlement`, {
        StartDate,
        EndDate,
      });
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
  }): Promise<PaparaResponse<CashdepositProvisionData>> {
    try {
      const subPath = `provision/${method.toLowerCase()}`;

      const requestBody = {
        ...(merchantReference !== undefined ? { merchantReference } : { merchantReference: uuid() }),
        amount,
        [method]: credential,
      };
      return await this.http.post<CashdepositProvisionData>(`/cashdeposit/${subPath}`, requestBody);
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
  async cashDepositProvisionByPhoneNumber(
    phoneNumber: string,
    amount: number,
    merchantReference?: string,
  ): Promise<PaparaResponse<CashdepositProvisionData>> {
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
  async cashDepositProvisionByAccountNumber(
    accountNumber: number,
    amount: number,
    merchantReference?: string,
  ): Promise<PaparaResponse<CashdepositProvisionData>> {
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
  async cashDepositProvisionByTCKN(
    tckn: string,
    amount: number,
    merchantReference?: string,
  ): Promise<PaparaResponse<CashdepositProvisionData>> {
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
  async cashDepositProvisionComplete(Id: number, TransactionDate: string): Promise<PaparaResponse<CashdepositData>> {
    try {
      const requestBody = { Id, TransactionDate };
      return await this.http.post<CashdepositData>(`/cashdeposit/provision/complete`, requestBody);
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
  async cashDepositProvisionSettlement(StartDate: string, EndDate: string): Promise<PaparaResponse<SettlementData>> {
    try {
      return await this.http.post<SettlementData>(`/cashdeposit/provision/settlement`, {
        StartDate,
        EndDate,
      });
    } catch (err) {
      throw err;
    }
  }

  private async cashDepositVerification(
    method: 'id' | 'merchantReference',
    credential: string | number,
  ): Promise<PaparaResponse<CashdepositData>> {
    try {
      const url =
        method === 'id' ? `/cashdeposit?id=${credential}` : `/cashdeposit/byreference?reference=${credential}`;
      return await this.http.get<CashdepositData>(url);
    } catch (err) {
      throw err;
    }
  }

  /**
   * Cashs deposit verification by id
   * @param id
   * @returns
   */
  async cashDepositVerificationById(id: number): Promise<PaparaResponse<CashdepositData>> {
    return this.cashDepositVerification('id', id);
  }

  /**
   * Cashs deposit verification by merchant reference
   * @param merchantReference
   * @returns
   */
  async cashDepositVerificationByMerchantReference(
    merchantReference: string,
  ): Promise<PaparaResponse<CashdepositData>> {
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
  async cashDepositVerificationByDate(
    StartDate: string,
    EndDate: string,
    PageIndex: number,
    PageItemCount: number,
  ): Promise<PaparaResponse<CashdepositData[]>> {
    try {
      const params = {
        StartDate,
        EndDate,
        PageIndex,
        PageItemCount,
      };
      return await this.http.get<CashdepositData[]>(`/cashdeposit/bydate`, { params });
    } catch (err) {
      throw err;
    }
  }

  /**
   * Banks accounts
   * @returns
   */
  async bankAccounts(): Promise<PaparaResponse<BankAccountsData[]>> {
    try {
      return await this.http.get<BankAccountsData[]>(`/banking/bankaccounts`);
    } catch (err) {
      throw err;
    }
  }

  /**
   * Banks withdrawal
   * @param { bankAccountId, amount }
   * @returns
   */
  async bankWithdrawal({
    bankAccountId,
    amount,
  }: {
    bankAccountId: number;
    amount: number;
  }): Promise<PaparaResponse<undefined>> {
    try {
      const requestBody = { amount, bankAccountId };
      return await this.http.post<undefined>(`/banking/withdrawal`, requestBody);
    } catch (err) {
      throw err;
    }
  }
}
