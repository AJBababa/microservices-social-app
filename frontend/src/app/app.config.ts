import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

import { LucideAngularModule, Home, User, LogOut, MessageCircle, Trash2, Heart, PlusCircle } from 'lucide-angular';
import { importProvidersFrom } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(LucideAngularModule.pick({ Home, User, LogOut, MessageCircle, Trash2, Heart, PlusCircle }))
  ],
};
