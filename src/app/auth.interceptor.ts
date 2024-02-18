// auth.interceptor.ts
/*import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Update the path as needed
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<any>,
    next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService); // Inject your AuthService
  const token = authService.getToken(); // Retrieve the token

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`, // Ensure this matches the expected format for your backend
      },
    });
    return next(cloned);
  } else {
    return next(req);
  }
};*/
