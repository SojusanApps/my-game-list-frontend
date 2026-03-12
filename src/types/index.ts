export type LocalStorageUserType = {
  email: string;
  token: string;
  refreshToken: string;
};

export type TokenInfoType = {
  exp: number;
  iat: number;
  jti: string;
  token_type: string;
  user_id: number;
};
