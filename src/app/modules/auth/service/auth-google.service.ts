import { HttpClient } from '@angular/common/http';
import { EventEmitter, inject, Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import * as jwt_decode from 'jwt-decode';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AsAuthServiceService } from '../../../core/services/as-auth-service.service';

@Injectable({ providedIn: 'root' })
export class AuthGoogleService {
  private isLoggedInStatus: boolean = false;
  private userRole: string = '';
  private loggedInUser: Usuario | null = null;

  private asAuthService: AsAuthServiceService = inject(AsAuthServiceService);

  loginSuccess$: EventEmitter<void> = new EventEmitter<void>();
  logoutSuccess$: EventEmitter<void> = new EventEmitter<void>();

  //private backendAuthUrl = gestion_autenticacion.api_url;

  constructor(
    private afAuth: AngularFireAuth,
    private http: HttpClient,
    private router: Router
  ) {
    // Recuperar el usuario autenticado del localStorage al iniciar
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      this.isLoggedInStatus = true;
      this.loggedInUser = JSON.parse(storedUser);
    }

    // Suscribirse al estado de autenticación sin sobrescribir loggedInUser
    this.afAuth.authState.subscribe((user) => {
      if (user && user.email?.endsWith('@unicauca.edu.co')) {
        this.isLoggedInStatus = true;

        // Configura solo los valores básicos, si no se ha autenticado con backend aún
        if (!this.loggedInUser) {
          this.loggedInUser = {
            username: user.displayName || '', // Asigna el nombre de usuario
            email: user.email,
            role: [], // Define un arreglo vacío o asigna roles según sea necesario
            phoneNumber: '',
            academicCode: '',
            firstName: '',
            lastName: '',
            idType: '',
            idNumber: '',
          };
          localStorage.setItem(
            'loggedInUser',
            JSON.stringify(this.loggedInUser)
          );
        }

        this.loginSuccess$.emit();
      } else {
        this.logout();
      }
    });
  }


  async loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account', // Forzar el selector de cuenta
    });

    const creds = await this.afAuth.signInWithPopup(provider);

    const idToken = creds.credential && (creds.credential as firebase.auth.OAuthCredential).idToken;

    this.sendTokenToBackend(idToken as string);
  }

  private sendTokenToBackend(authToken: string): void {
    this.asAuthService.loginGoogle(authToken).subscribe({
      next: (response) => {
        const jwtToken = response.token;
        const tokenOriginal = authToken;
        localStorage.setItem('token', tokenOriginal);

        this.isLoggedInStatus = true;

        // Decodificar el token y extraer la información del usuario
        const decodedToken: any = jwt_decode.jwtDecode(jwtToken);
        this.loggedInUser = {
          username: decodedToken.username,
          email: decodedToken.correo,
          role: decodedToken.rol || [],
          phoneNumber: decodedToken.telefono,
          academicCode: decodedToken.codigoAcademico,
          firstName: decodedToken.nombres,
          lastName: decodedToken.apellidos,
          idType: decodedToken.tipoIdentificacion,
          idNumber: decodedToken.numeroIdentificacion,
        };

        // Guardar el usuario decodificado en el localStorage
        localStorage.setItem('loggedInUser', JSON.stringify(this.loggedInUser));

        this.loginSuccess$.emit();
      },
      error: (error) => {
        this.logout();
      },
    });
  }


  logout(): void {
    this.afAuth.signOut().then(() => {
      this.isLoggedInStatus = false;
      this.loggedInUser = null;
      // Limpiar el localStorage de los datos requeridos
      localStorage.removeItem('loggedInUser');
      localStorage.removeItem('token');
      this.router.navigate(['']);

      // Emitir evento de logout
      this.logoutSuccess$.emit();
    });
  }

  isLoggedIn(): boolean {
    return this.isLoggedInStatus;
  }

  getLoggedInUser(): Usuario | null {
    return this.loggedInUser;
  }

  getRole(): string[] | null {
    return this.loggedInUser ? this.loggedInUser.role : [];
  }

  getFullName(): string {
    return this.loggedInUser ? this.loggedInUser.username : '';
  }

  getEmail(): string {
    return this.loggedInUser ? this.loggedInUser.email : '';
  }

  hasRole(role: string): boolean {
    return this.loggedInUser ? this.loggedInUser.role.includes(role) : false;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

interface Usuario {
  username: string;
  email: string;
  role: string[];
  phoneNumber: string;
  academicCode: string;
  firstName: string;
  lastName: string;
  idType: string;
  idNumber: string;
}
