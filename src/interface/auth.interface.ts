// JWT Response
export interface IJwtRequest {
  id: string;
  email: string,
  role: string,
  type: number,
  iat: number;
}

// data {
//   id: '553cce92-acf7-41d7-bc18-049f3a50afb4',
//   email: 'test@example20.com',
//   role: 'user',
//   type: 0,
//   iat: 1708951932
// }