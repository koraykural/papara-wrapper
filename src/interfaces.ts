export interface UnsuccessfulResponse {
  succeeded: false;
  error: {
    code: number;
    message: string;
  };
}

export interface PaparaValidateUserResponse {
  succeeded: boolean;
  error: {
    code: number;
    message: string;
  };
  data: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    tckn: string;
    accountNumber: string;
  };
}
export interface PaparaMasspaymentResponse {
  succeeded: boolean;
  error: {
    code: number;
    message: string;
  };
  data: {
    massPaymentId: string;
    id: string;
    createdAt: Date;
    amount: number;
    fee: number;
    resultingBalance: number;
    description: string;
  };
}
export interface PaparaMasspaymentVerificationResponse {
  succeeded: boolean;
  error: {
    code: number;
    message: string;
  };
  data: {
    massPaymentId: string;
    id: string;
    createdAt: Date;
    amount: number;
    fee: number;
    resultingBalance: number;
    description: string;
  };
}

export interface UserValidation {
  succeeded: true;
  data: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    tckn: string;
    accountNumber: string;
  };
}

export interface Masspayment {
  succeeded: true;
  data: {
    massPaymentId: string;
    id: string;
    createdAt: Date;
    amount: number;
    fee: number;
    resultingBalance: number;
    description: string;
  };
}

export interface MasspaymentVerification {
  succeeded: true;
  data: {
    massPaymentId: string;
    id: string;
    createdAt: Date;
    amount: number;
    fee: number;
    resultingBalance: number;
    description: string;
  };
}
