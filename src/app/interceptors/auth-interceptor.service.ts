// Core Imports
import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
import { take, exhaustMap } from 'rxjs/operators';

// Services
import { AuthService } from "../services/auth/auth.service";

@Injectable()

export class AuthInterceptorService implements HttpInterceptor {

    constructor(private _authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return this._authService.getCurrentUserData().pipe(
            take(1),
            exhaustMap(
                user => {
                    if (!user) {
                        return next.handle(req);
                    }
                    const user_tokken = user.tokken;
                    const modifiedReq = req.clone({
                        headers: req.headers.set("Authorization", "Bearer " + user_tokken)
                    });
                    return next.handle(modifiedReq);
                }
            )
        )
    }

}