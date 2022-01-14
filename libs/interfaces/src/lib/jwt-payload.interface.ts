export interface JwtPayloadInterface {
  id: string,
  email: string,
  firstName: string,
  lastName: string,
  iat?: Date;
}
