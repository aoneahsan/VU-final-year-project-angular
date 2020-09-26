// Core Imports
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Services
import { SystemService } from '../system.service';

// Interfaces
import { HallDetailInterface } from 'src/app/interfaces/hall/hall-detail.interface';

@Injectable({
    providedIn: 'root'
})

export class HallManagerService {

    constructor(private _systemService: SystemService, private _http: HttpClient) {}

    // Halls Related Functions
    getAllHalls() {
        return this._http.get<any>(
            this._systemService.getApiRootURL() + `hall-manager/halls`
        );
    }

    getHall(id) {
        return this._http.get<any>(
            this._systemService.getApiRootURL() + `hall-manager/halls/${id}`
        );
    }

    createHall(data: HallDetailInterface) {
        return this._http.post<any>(
            this._systemService.getApiRootURL() + `hall-manager/halls`,
            data
        );
    }

    updateHall(data: HallDetailInterface) {
        return this._http.post<any>(
            this._systemService.getApiRootURL() + `hall-manager/halls/${data.id}`,
            data
        );
    }

    deleteHall(id) {
        return this._http.delete<any>(
            this._systemService.getApiRootURL() + `hall-manager/halls/${id}`
        );
    }
}
