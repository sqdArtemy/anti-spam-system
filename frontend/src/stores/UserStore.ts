import {makeAutoObservable} from 'mobx';
import {authService} from '../api/services/authService';
import {userService} from '../api/services/userService';
import {AxiosError, AxiosResponse} from 'axios';
import {ILoginResponse} from '../api/interfaces/responses/auth';
import {IUserResponse} from '../api/interfaces/responses/user';
import {IRegisterRequest} from '../api/interfaces/requests/auth';

type CurrentUserData = ILoginResponse['user'];

class UserStore {
    storeData: CurrentUserData = {} as CurrentUserData;
    state: 'pending' | 'loading' | 'success' | 'error' = 'pending';
    layoutState: 'pending' | 'loading' | 'success' | 'error' = 'pending';
    errorMessage: string = '';

    constructor() {
        makeAutoObservable(this);
    }

    set currentState(state: 'pending' | 'loading' | 'success' | 'error') {
        this.state = state;
    }

    get data(): CurrentUserData {
        if (!this.storeData?.name) {
            this.fetchCurrentUser();
        }
        return this.storeData;
    }

    set data(data: CurrentUserData) {
        this.storeData = data;
    }

    set errorMsg(error: string) {
        if (error[0] === '{') {
            error = 'Something went wrong.';
        }
        this.errorMessage = error;
    }

    get errorMsg() {
        return this.errorMessage;
    }

    reset() {
        this.currentState = 'pending';
        this.errorMsg = '';
        this.data = {} as CurrentUserData;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }

    fetchCurrentUser() {
        this.currentState = 'loading';
        userService
            .getCurrentUser()
            .then(this.fetchCurrentUserSuccess, this.fetchCurrentUserFailure);
    }

    fetchCurrentUserSuccess = ({data}: AxiosResponse<IUserResponse>) => {
        this.data = {...this.storeData, ...data};
        this.currentState = 'success';
        this.layoutState = 'success';
    };

    fetchCurrentUserFailure = ({response}: AxiosError<string>) => {
        this.currentState = 'error';
        this.layoutState = 'error';
        this.errorMsg = response?.data || 'Something went wrong';
    };

    // Login action
    login(email: string, password: string) {
        this.currentState = 'loading';
        authService
            .login({email, password})
            .then(this.loginSuccess, this.loginFailure);
    }

    loginSuccess = ({data}: AxiosResponse<ILoginResponse>) => {
        this.reset();
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        this.data = data.user;
        this.currentState = 'success';
    };

    loginFailure = ({response}: AxiosError<string>) => {
        this.currentState = 'error';
        this.errorMsg = response?.data || 'Something went wrong';
    };

    logout() {
        this.currentState = 'loading';
        authService.logOut().then(this.logoutSuccess, this.logoutFailure);
    }

    logoutSuccess = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.reset();
        this.currentState = 'success';
    };

    logoutFailure = ({response}: AxiosError<string>) => {
        this.currentState = 'error';
        this.errorMsg = response?.data || 'Something went wrong';
    };

    register(data: IRegisterRequest) {
        this.currentState = 'loading';
        authService
            .register(data)
            .then(this.registerSuccess, this.registerFailure);
    }

    registerSuccess = ({data}: AxiosResponse<ILoginResponse>) => {
        this.reset();
        this.data = {...this.storeData, ...data};
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        this.currentState = 'success';
    };

    registerFailure = ({response}: AxiosError<string>) => {
        this.currentState = 'error';
        this.errorMsg = response?.data || 'Something went wrong';
    };

    // // Update user action
    // updateUser(id: number, data: IUpdateUserRequest) {
    //     this.currentState = 'loading';
    //     userService
    //         .updateUser(id, data)
    //         .then(this.updateUserSuccess, this.updateUserFailure);
    // }
    //
    // updateUserSuccess = ({ data }: AxiosResponse<IUpdateUserRequest>) => {
    //     this.data = { ...this.storeData, ...data };
    //     this.currentState = 'success';
    // };
    //
    // updateUserFailure = ({ response }: AxiosError<string>) => {
    //     this.currentState = 'error';
    //     this.errorMsg = response?.data || 'Something went wrong';
    // };
}

const userStore = new UserStore();
export default userStore;
