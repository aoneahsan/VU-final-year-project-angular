import { Injectable } from '@angular/core';
import { SystemService } from '../system.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class AdminService {

    constructor(private _systemService: SystemService, private _http: HttpClient) {}

    getAllCustomers() {
        return this._http.get<any>(
            this._systemService.getApiRootURL() + 'admin/get-customers'
        );
    }

    getAllHallManagers() {
        return this._http.get<any>(
            this._systemService.getApiRootURL() + 'admin/get-hall_managers'
        );
    }

    getAllHalls() {
        return this._http.get<any>(
            this._systemService.getApiRootURL() + 'admin/get-halls'
        );
    }

    getAllBookings() {
        return this._http.get<any>(
            this._systemService.getApiRootURL() + 'admin/get-bookings'
        );
    }

}