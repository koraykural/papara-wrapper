# Papara API Wrapper
**This package is still in development!**

This package is a wrapper for [Papara API](https://merchant-api.papara.com/). Currently covers user validation and mass payment endpoints.


## Installation
```npm install --save papara-wrapper```


## Usage
```
import Papara from "papara-wrapper";

const papara = new Papara("API_KEY");

papara.verificateUserByAccountNumber("USER_ID")
  .then(res => {
    console.log(res.succeeded); // true if account number is valid
  })
  .catch(err => {
    console.log(err); // axios error
  })
```

## Implemented Methods
 - User Verification `{{ BaseUrl }}/validation`
	 - verificateUserByAccountNumber
	 - verificateUserByEmail
	 - verificateUserByPhoneNumber
	 - verificateUserByTCKN
 - Masspayment  `{{ BaseUrl }}/masspayment`
	 - masspaymentByAccountNumber
	 - masspaymentByEmail
	 - masspaymentByPhone


## Configuration Options

### Test Enviroment
Second parameter of the constructor is whether test environment will be used or not and it is false by default. So you can switch to test environment like this:
```
const papara = new Papara("TEST_API_KEY", true);
``` 
If test enviroment is enabled, all requests will be sent to `https://merchant.test.api.papara.com/`. Thus, make sure you are using a test API key.