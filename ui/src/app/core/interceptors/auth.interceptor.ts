import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('Bearer');
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: token
      }
    });
    return next(cloned);
  }
  return next(req);
};
