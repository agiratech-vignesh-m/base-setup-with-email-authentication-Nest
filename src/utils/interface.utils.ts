// Enum
export enum JwtTypeEnum {
  LOGIN,
  VERIFY_EMAIL,
}

// JWT
export interface IJwtConfig {
  secret: string;
  expiresIn: string;
}

// Badge

export interface IBadgeDetails {
  name: string,
  image: string
}

// Ethereum
export interface IWeb3 {
  provider: string;
  mnemonic: string;
  privateKey: string;
  publicKey: string;
}

export interface IWeb3PublicTransfer {
  wallet_address: string;
  amount: number;
}
