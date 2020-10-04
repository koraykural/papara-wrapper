import Papara from '../index';

const axiosMock = {
  get: jest.fn(() => Promise.resolve({ data: { succeeded: true } })),
  post: jest.fn(() => Promise.resolve({ data: { succeeded: true } })),
  put: jest.fn(() => Promise.resolve({ data: { succeeded: true } })),
  interceptors: {
    request: {
      use: jest.fn(),
    },
    response: {
      use: jest.fn(),
    },
  },
};

jest.mock('axios', () => ({ create: jest.fn(() => axiosMock) }));

const papara = new Papara({ API_KEY: 'API_KEY' });

describe('Account Information', () => {
  it('account', async () => {
    const response = await papara.account();
    expect(response.succeeded).toBe(true);
  });

  it('account ledgers', async () => {
    const response = await papara.accountLedgers({
      startDate: '09/01/2019 00:00:00',
      endDate: '09/18/2019 00:00:00',
      pageSize: 50,
      page: 1,
    });
    expect(response.succeeded).toBe(true);
  });

  it('account settlements', async () => {
    const response = await papara.accountSettlement({
      startDate: '09/01/2019 00:00:00',
      endDate: '09/18/2019 00:00:00',
    });
    expect(response.succeeded).toBe(true);
  });
});

describe('User Validation', () => {
  it('by account number', async () => {
    const response = await papara.validationByAccountNumber(631651615);
    expect(response.succeeded).toBe(true);
  });

  it('by email', async () => {
    const response = await papara.validationByEmail('john@doe.com');
    expect(response.succeeded).toBe(true);
  });

  it('by phone number', async () => {
    const response = await papara.validationByPhoneNumber('905325323232');
    expect(response.succeeded).toBe(true);
  });

  it('by turkish national id', async () => {
    const response = await papara.validationByTCKN('12345678900');
    expect(response.succeeded).toBe(true);
  });
});

describe('payments', () => {
  it('payments', async () => {
    const response = await papara.payments({
      amount: 10,
      orderDescription: 'Kullanıcının ödeme sayfasında göreceği açıklama',
      notificationUrl: 'notification.com/url',
      redirectUrl: 'redirect.com/url',
    });
    expect(response.succeeded).toBe(true);
  });

  it('payments validation', async () => {
    const response = await papara.paymentsValidation('id_string');
    expect(response.succeeded).toBe(true);
  });

  it('payments refund', async () => {
    const response = await papara.paymentsRefund('id_string');
    expect(response.succeeded).toBe(true);
  });
});

describe('Mass Payments', () => {
  it('by account number', async () => {
    const response = await papara.masspaymentByAccountNumber({ accountNumber: 1561561, amount: 10 });
    expect(response.succeeded).toBe(true);
  });

  it('by email', async () => {
    const response = await papara.masspaymentByEmail({ email: 'john@doe.com', amount: 10 });
    expect(response.succeeded).toBe(true);
  });

  it('by phone number', async () => {
    const response = await papara.masspaymentByPhone({ phoneNumber: '905325323232', amount: 10 });
    expect(response.succeeded).toBe(true);
  });

  it('with Turkish national Id and massPaymentId', async () => {
    const response = await papara.masspaymentByAccountNumber({
      accountNumber: 1561561,
      amount: 10,
      turkishNationalId: '616516',
      massPaymentId: 'asddg',
    });
    expect(response.succeeded).toBe(true);
  });
});

describe('Mass Payment Verification', () => {
  it('with id', async () => {
    const response = await papara.masspaymentVerficationById('ID');
    expect(response.succeeded).toBe(true);
  });

  it('with masspaymentId', async () => {
    const response = await papara.masspaymentVerficationByMasspaymentId('mass-payment-id');
    expect(response.succeeded).toBe(true);
  });
});

describe('Cash Deposit', () => {
  it('with phone number', async () => {
    const response = await papara.cashDepositByPhoneNumber('905325323232', 10);
    expect(response.succeeded).toBe(true);
  });

  it('with account number', async () => {
    const response = await papara.cashDepositByAccountNumber(165131561, 10);
    expect(response.succeeded).toBe(true);
  });

  it('with tckn', async () => {
    const response = await papara.cashDepositByTCKN('12345678900', 10);
    expect(response.succeeded).toBe(true);
  });

  it('verification with id', async () => {
    const response = await papara.cashDepositVerificationById(1563216);
    expect(response.succeeded).toBe(true);
  });

  it('verification with merchant reference', async () => {
    const response = await papara.cashDepositVerificationByMerchantReference('MERCHANT_REFERENCE');
    expect(response.succeeded).toBe(true);
  });

  it('Cash Deposit Settlement', async () => {
    const response = await papara.cashDepositSettlement('09/01/2019 00:00:00', '09/18/2019 00:00:00');
    expect(response.succeeded).toBe(true);
  });
});

describe('Cash Deposit Provision', () => {
  it('with phone number', async () => {
    const response = await papara.cashDepositProvisionByPhoneNumber('905325323232', 10);
    expect(response.succeeded).toBe(true);
  });

  it('with account number', async () => {
    const response = await papara.cashDepositProvisionByAccountNumber(165131561, 10);
    expect(response.succeeded).toBe(true);
  });

  it('with tckn', async () => {
    const response = await papara.cashDepositProvisionByTCKN('12345678900', 10);
    expect(response.succeeded).toBe(true);
  });

  it('Completion', async () => {
    const response = await papara.cashDepositProvisionComplete(156, '2019.01.22 12:34');
    expect(response.succeeded).toBe(true);
  });

  it('Cash Deposit Provision Settlement', async () => {
    const response = await papara.cashDepositProvisionSettlement('09/01/2019 00:00:00', '09/18/2019 00:00:00');
    expect(response.succeeded).toBe(true);
  });

  it('verification with date', async () => {
    const response = await papara.cashDepositVerificationByDate('09/01/2019 00:00:00', '09/18/2019 00:00:00', 1, 50);
    expect(response.succeeded).toBe(true);
  });

  it('verification with merchant reference', async () => {
    const response = await papara.cashDepositVerificationByMerchantReference('MERCHANT_REFERENCE');
    expect(response.succeeded).toBe(true);
  });
});

describe('Banking', () => {
  it('bank accounts', async () => {
    const response = await papara.bankAccounts();
    expect(response.succeeded).toBe(true);
  });

  it('banking withdrawal', async () => {
    const response = await papara.bankWithdrawal({ bankAccountId: 21, amount: 10 });
    expect(response.succeeded).toBe(true);
  });
});
