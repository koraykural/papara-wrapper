# Papara API Wrapper

This package is a wrapper for [Papara API](https://merchant-api.papara.com/). It handles HTTP requests and authentication.

## Installation

`npm install --save papara-wrapper`

## Usage

```
const Papara = require("papara-wrapper");

const papara = new Papara({ API_KEY: "API_KEY" });

papara.validationByAccountNumber(USER_ACCOUNT_NUMBER)
  .then(res => {
    console.log(res.succeeded); // true if account number is valid
  })
  .catch(err => {
    console.log(err); // axios error
  })
```

## Methods

- [Account](https://merchant-api.papara.com/#Account)
  - account
  - accountLedgers
  - accountSettlement
- [User Validation](https://merchant-api.papara.com/#UserValidation)
  - validationByAccountNumber
  - validationByEmail
  - validationByPhoneNumber
  - validationByTCKN
- [Checkout](https://merchant-api.papara.com/#AcceptPayments)
  - payments
  - paymentsValidation
  - paymentsRefund
- [Masspayment](https://merchant-api.papara.com/#MassPayments)
  - masspaymentByAccountNumber
  - masspaymentByEmail
  - masspaymentByPhone
  - masspaymentVerficationById
  - masspaymentVerficationByMasspaymentId
- [Cash Deposit](https://merchant-api.papara.com/#PhysicalPoint)
  - cashDepositByPhoneNumber
  - cashDepositByAccountNumber
  - cashDepositByTCKN
  - cashDepositSettlement
  - cashDepositVerificationById
  - cashDepositVerificationByMerchantReference
- [Cash Deposit Provisional](https://merchant-api.papara.com/#PhysicalPointPostpaid)
  - cashDepositProvisionByPhoneNumber
  - cashDepositProvisionByAccountNumber
  - cashDepositProvisionByTCKN
  - cashDepositProvisionComplete
  - cashDepositProvisionSettlement
  - cashDepositVerificationByMerchantReference
  - cashDepositVerificationByDate
- [Banking](https://merchant-api.papara.com/#Banking)
  - bankAccounts
  - bankWithdrawal

You can find further information about these methods in official documentation of [Papara](https://merchant-api.papara.com/)

## Configuration Options

### Test Enviroment

An optional paramter of the constructor is `testEnv`. This property decides whether test environment will be used or not and it is `false` by default. So you can switch to test environment like this:

```
const papara = new Papara({ API_KEY: "API_KEY", testEnv: true });
```

If test enviroment is enabled, all requests will be sent to `https://merchant.test.api.papara.com/`. Thus, make sure you are using a test API key. [See more](https://merchant-api.papara.com/#LiveTestEnv);

## Author

Koray Kural

Feel free to [mail](mailto:koraykural99@gmail.com) me.

**This package is not officially maintained by [Papara Team](https://www.papara.com/).**

## License

[ISC](https://opensource.org/licenses/ISC)
