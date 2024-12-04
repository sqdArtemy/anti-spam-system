import {axiosInstance} from '../axios.ts';
import {
    ILoginRequest,
    IRegisterRequest,
} from '../interfaces/requests/auth.ts';
import {
    ILoginResponse,
    ILogoutResponse,
    IRefreshTokenResponse,
} from '../interfaces/responses/auth.ts';

export class AuthService {
    public register = async (data: IRegisterRequest) => {
        const url = '/user/register';
        return axiosInstance.post<ILoginResponse>(url, data);
    };

    public login = async (data: ILoginRequest) => {
        const url = '/user/login';
        console.log(data);
        return axiosInstance.post<ILoginResponse>(url, data);
    };

    public logOut = async (): Promise<ILogoutResponse> => {
        const url = '/user/logout';
        const response = await axiosInstance.get(url);

        return response.data as ILogoutResponse;
    };

    public refreshToken = async (refreshToken: string) => {
        console.trace();
        const url = '/token/refresh';
        return axiosInstance.get<IRefreshTokenResponse>(url, {
            headers: {
                Authorization: `Bearer ${refreshToken}`,
            },
        });
    };
}

export const authService = new AuthService();