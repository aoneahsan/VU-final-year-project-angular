import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanLoad, Route, UrlSegment, CanActivateChild, Router } from "@angular/router";
import { Observable } from "rxjs";

import { AuthService } from './../../services/auth/auth.service';
import { take, map } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})

export class SimpleAuthGuard implements CanActivate, CanActivateChild, CanLoad {

    constructor(private _authService: AuthService, private _router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this._authService.getCurrentUserData().pipe(
            take(1),
            map(
                user => {
                    // return true;
                    const isAuth = !!user;
                    if (isAuth) {
                        return true;
                    } else {
                        this._router.navigate(['/sign-in']);
                        return false;
                    }
                }
            )
        );
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.canActivate(route, state);
    }

    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
        return this._authService.getCurrentUserData().pipe(
            take(1),
            map(
                user => {
                    // return true;
                    const isAuth = !!user;
                    if (isAuth) {
                        return true;
                    } else {
                        this._router.navigate(['/sign-in']);
                        return false;
                    }
                }
            )
        );
    }
}