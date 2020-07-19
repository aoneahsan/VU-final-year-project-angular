import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import { BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

import { SystemService } from '../system.service';

import { User } from 'src/app/models/auth/user-model';

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    private _user = new BehaviorSubject<User>(null);
    private _tokkenExpirationTime: any = null;

    private _userRole = new BehaviorSubject<'admin' | 'hall_manager' | 'customer'>(null);

    constructor(
        private _router: Router,
        private _http: HttpClient,
        private _systemService: SystemService
    ) { }

    getCurrentUserData() {
        return this._user;
    }

    setCurrentUserData(data) {
        this._user.next(data);
    }

    getUserRole() {
        return this._userRole;
    }

    signIn(data) {
        //check user to sign in
        return this._http.post<any>(
            this._systemService.getApiRootURL() + 'login',
            data
        )
            .pipe(
                catchError(this.errorHandler),
                tap(
                    res => {
                        this.authManager(res.data);
                    }
                )
            );
    }

    signUp(data) {
        return this._http.post<any>(
            this._systemService.getApiRootURL() + 'register',
            data
        )
            .pipe(
                catchError(this.errorHandler),
                tap(
                    res => {
                        this.authManager(res.data);
                    }
                )
            );
    }

    logout() {
        // this.logoutUserFormApp();
        this._systemService.loadingPageDataTrue();
        const data = "ok";
        this._http.post<any>(
            this._systemService.getApiRootURL() + 'logout',
            data
        ).subscribe(
            res => {
                this.logoutUserFormApp();
                window.location.reload();
                // console.log('Logout Request API Done, Response = ', res);
            },
            err => {
                this.logoutUserFormApp();
                window.location.reload();
                // console.log('Error While Logout Request API, Error = ', err);
            }
        );
    }

    logoutUserFormApp() {
        localStorage.removeItem('user_data');
        this._user.next(null);
        if (this._tokkenExpirationTime) {
            clearTimeout(this._tokkenExpirationTime);
        }
        this._tokkenExpirationTime = null;
        this._router.navigate(['/sign-in']);
    }

    autoLogin() {
        if (localStorage.getItem('user_data')) {
            const userData: User = JSON.parse(localStorage.getItem('user_data'));
            const localUser = new User(
                userData.id,
                userData.name,
                userData.email,
                userData.phone_number,
                userData.profile_img,
                userData.role,
                userData._tokken,
                new Date(userData.tokken_expire_time)
            );
            this._user.next(localUser);
            this._userRole.next(localUser.role);
            this.checkLoginStatus();
        } else {
            console.log("User Data not Found");
            return;
        }
    }

    checkLoginStatus() {
        this._http.get(
            this._systemService.getApiRootURL() + 'check-login-status'
        ).subscribe(
            res => {

            },
            err => {
                if (err.status == 401) {
                    this.logout();
                }
            }
        );
    }

    private errorHandler(errorRes: HttpErrorResponse) {
        let errorMessage = "Error Occured"
        console.log("check this ok", errorRes.status);
        if (errorRes.status == 401) {
            this.logout();
        }
        switch (errorRes.message) {
            case "invalid Data":
                errorMessage = "Invalid Data Entered";
                break;
        }
        return throwError(errorRes);
    }

    authManager(response) {
        console.log('authManager  ==  response', response);
        const expireDate = new Date((new Date().getTime() + 10000) * 1000);
        const newUser = new User(
            response.id,
            response.name,
            response.email,
            response.phone_number,
            response.profile_img,
            response.role,
            response.tokken,
            expireDate
        );
        this._user.next(newUser);
        this._userRole.next(newUser.role);
        localStorage.setItem('user_data', JSON.stringify(newUser));
    }
}