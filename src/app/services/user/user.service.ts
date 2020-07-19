import { Injectable } from '@angular/core';
import { SystemService } from '../system.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class UserService {

    constructor(private _systemService: SystemService, private _http: HttpClient) {}

    getUserProfileData() {
        return this._http.get<any>(
            this._systemService.getApiRootURL() + 'user/profile'
        );
    }

    editUserProfileData(data) {
        return this._http.post<any>(
            this._systemService.getApiRootURL() + 'user/profile',
            data
        );
    }

    deleteUserAccount() {
        return this._http.delete<any>(
            this._systemService.getApiRootURL() + 'user/profile'
        );
    }

    getUserBookings() {
        return this._http.get<any>(
            this._systemService.getApiRootURL() + 'user/bookings'
        );
    }

    searchHalls(data) {
        return this._http.post<any>(
            this._systemService.getApiRootURL() + 'search-halls',
            data
        );
    }

}