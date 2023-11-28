export interface ICachedUsers {
  [id: number]: 'admin' | 'user' | null;
}

export interface IGoogleUser {
  provider: string;
  providerId: string;
  email: string;
  name: string;
  picture: string;
}

export interface IJwtPayload {
  sub: string;
  email: string;
}
