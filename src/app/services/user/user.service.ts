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

    editUserProfileData(data, userID) {
        return this._http.put<any>(
            this._systemService.getApiRootURL() + `user/profile/${userID}`,
            data
        );
    }

    updateProfileImage(data, userID) {
      return this._http.post<any>(
        this._systemService.getApiRootURL() + `user/profile-img/${userID}/update`,
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
