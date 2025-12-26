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

// TODO: Shouldn't it be a type on backend?
export interface NotificationActor {
  id: number;
  str: string;
  type: string;
}

export interface NotificationUnreadCount {
  unread_count: number;
}
