import {IUserResponse} from '../interfaces/responses/user.ts';
import {axiosInstance} from '../axios.ts';

// import { IUpdateUserRequest } from '../interfaces/requests/users.ts';

export class UserService {
    public getCurrentUser = async () => {
        const url = '/me';
        return axiosInstance.get<IUserResponse>(url);
    };

    public getUserById = async (id: number): Promise<IUserResponse> => {
        const url = '/user/' + id;
        const response = await axiosInstance.get(url);

        return response.data as IUserResponse;
    };

    // public updateUser = async (id: number, data: IUpdateUserRequest) => {
    //     const url = '/user/' + id;
    //     return axiosInstance.put<IUpdateUserRequest>(url, data);
    // };

    public deleteUser = async (id: number) => {
        const url = '/user/' + id;
        await axiosInstance.delete(url);
    };
}

export const userService = new UserService();