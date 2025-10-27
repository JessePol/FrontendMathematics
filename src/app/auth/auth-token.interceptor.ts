import {HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {inject} from '@angular/core';
import {AuthService} from '../service/auth.service';
import {environment} from '../../environments/environment';

export const authTokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {


  const authService = inject(AuthService);
  const authToken = authService.getToken();


  if (authToken && req.url.startsWith(environment.apiUrl)) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });

    return next(authReq);
  }

  return next(req);
};
