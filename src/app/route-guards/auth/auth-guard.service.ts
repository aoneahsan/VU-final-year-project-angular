import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanLoad, Route, UrlSegment, CanActivateChild, Router } from "@angular/router";
import { Observable } from "rxjs";

import { AuthService } from './../../services/auth/auth.service';
import { take, map } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

    constructor(private _authService: AuthService, private _router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this._authService.getCurrentUserData().pipe(
            take(1),
            map(
                user => {
                    // return true;
                    const isAuth = !!user;
                    if (isAuth) {
                        const userRole = user.role;
                        // console.log("AuthGuard == userRole =", userRole);
                        if (userRole == 'admin') {
                            this._router.navigate(['/admin/dashboard']);
                            return false;
                        }
                        else if ((userRole == 'hall_manager') || (userRole == 'customer')) {
                            return true;
                        }
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
                        if (route.path == 'home' && (user.role == 'admin')) {
                            this._router.navigate(['/admin/dashboard']);
                            return false;
                        } else {
                            return true;
                        }
                    } else {
                        this._router.navigate(['/sign-in']);
                        return false;
                    }
                }
            )
        );
    }
}