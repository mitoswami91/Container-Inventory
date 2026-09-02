import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations'

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common'
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [{
    provide: DATE_PIPE_DEFAULT_OPTIONS,
    useValue: { dateFormat: 'longDate' }
  },
  provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
  provideAnimations(),
  provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes),
  ],
};
