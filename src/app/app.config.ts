import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import {  getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { environments } from '../environments/environments';


export const appConfig: ApplicationConfig = {
  providers: [
    {provide: FIREBASE_OPTIONS, useValue: environments.firebaseConfig},
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideToastr(),
    provideAnimations(),
    provideFirestore(() => getFirestore()),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'sed-fiet-unicauca',
        appId: '1:978006211217:web:bdfa8b05b30c4d0972dd30',
        storageBucket: 'sed-fiet-unicauca.firebasestorage.app',
        apiKey: 'AIzaSyDraRIAHEQTxallqQvuEJ42NetIXjbXpf4',
        authDomain: 'sed-fiet-unicauca.firebaseapp.com',
        messagingSenderId: '978006211217',
        measurementId: 'G-BTLGTJ0CSH',
      })
    ),
    provideAuth(() => getAuth()),

  ],
};
