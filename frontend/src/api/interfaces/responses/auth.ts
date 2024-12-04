import { IUserResponse } from './user.ts';

export interface ILoginResponse {
    user: IUserResponse
    accessToken: string;
    refreshToken: string;
}

export interface ILogoutResponse {
    message: string;
}

export interface IRefreshTokenResponse {
    accessToken: string;
}