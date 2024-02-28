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
