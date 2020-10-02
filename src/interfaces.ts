export interface UnsuccessfulResponse {
  succeeded: false;
  data: null;
  error: {
    code: number;
    message: string;
  };
}

export interface SuccessfulResponse<T> {
  succeeded: true;
  data: T;
}

export type PaparaResponse<T> = UnsuccessfulResponse | SuccessfulResponse<T>;

export interface AccountData {
  legalName: string;
  brandName: string;
  allowedPaymentTypes: [
    {
      paymentMethod: number;
    },
  ];
  balances: [
    {
      currency: number;
      totalBalance: number;
      lockedBalance: number;
      availableBalance: number;
    },
  ];
}

export interface AccountLedgersData {
  items: [
    {
      id: number;
      createdAt: string;
      entryType: number;
      entryTypeName: string;
      amount: number;
      fee: number;
      currency: number;
      currencyInfo: {
        currencyEnum: number;
        symbol: string;
        code: string;
        preferredDisplayCode: string;
        name: string;
        isCryptocurrency: false;
        precision: number;
        iconUrl: string;
      };
      resultingBalance: number;
      description: string;
      massPaymentId: null | string;
      checkoutPaymentId: null | string;
      checkoutPaymentReferenceId: null | string;
    },
  ];
  page: number;
  pageItemCount: number;
  totalItemCount: number;
  totalPageCount: number;
  pageSkip: number;
}

export interface SettlementData {
  count: number;
  volume: number;
}

export interface PaymentsData {
  merchant: {
    legalName: string;
    brandName: string;
    allowedPaymentTypes: [
      {
        paymentMethod: number;
      },
    ];
    balances: [
      {
        currency: number;
        totalBalance: number;
        lockedBalance: number;
        availableBalance: number;
      },
    ];
  };
  userId: null | string;
  paymentMethod: 0 | 1 | 2;
  paymentMethodDescription: string;
  referenceId: string;
  orderDescription: string;
  status: 0 | 1 | 2;
  statusDescription: string;
  amount: number;
  fee: number;
  currency: number;
  notificationUrl: string;
  notificationDone: boolean;
  redirectUrl: string;
  paymentUrl: string;
  merchantSecretKey: null | string;
  returningRedirectUrl: string;
  turkishNationalId: string;
  id: string;
  createdAt: string;
}

export interface ValidationData {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  tckn: string;
  accountNumber: string;
}

export interface MasspaymentData {
  massPaymentId: string;
  id: string;
  createdAt: Date;
  amount: number;
  fee: number;
  resultingBalance: number;
  description: string;
}

export interface CashdepositData {
  merchantReference: string;
  id: number;
  createdAt: string;
  amount: number;
  fee: number;
  resultingBalance: number;
  description: string;
}

export interface CashdepositProvisionData {
  id: number;
  createdAt: string;
  amount: number;
  userFullName: string;
}

export interface MasspaymentVerificationData {
  massPaymentId: string;
  id: string;
  createdAt: Date;
  amount: number;
  fee: number;
  resultingBalance: number;
  description: string;
}

export interface BankAccountsData {
  bankAccountId: number;
  bankName: string;
  branchCode: string;
  iban: string;
  accountCode: string;
  description: string;
  currency: string;
}
