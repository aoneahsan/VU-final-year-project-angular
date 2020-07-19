import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { environment } from './../../environments/environment';

let API_ROOT_URL = '';

if(environment.production) {
    API_ROOT_URL = 'https://domain_name.com/api/'; // production api
}
else {
    API_ROOT_URL = 'http://localhost:8000/api/'; // local api
}

@Injectable({
    providedIn: 'root'
})

export class SystemService {

    // App Loading Status Manager
    private _loadingPageData = new BehaviorSubject<boolean>(false);
    
    // Backend Api Root Url
    private _apiRootURL: string = API_ROOT_URL; // this will automatically change depending on environment mode


    constructor() { }

    getLoadingPageDataStatus() {
        return this._loadingPageData;
    }

    loadingPageDataTrue() {
        this._loadingPageData.next(true);
    }

    loadingPageDataFalse() {
        this._loadingPageData.next(false);
    }

    getApiRootURL() {
        return this._apiRootURL;
    }
}