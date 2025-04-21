import {
  computed,
  EventEmitter,
  inject,
  Injectable,
  signal,
  SimpleChange,
} from '@angular/core';
import { AsAuthServiceService } from '../../../core/services/as-auth-service.service';
import { of, tap } from 'rxjs';
import { UsuarioResponse } from '../../../core/models/response/usuario-response.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as jwt_decode from 'jwt-decode';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private asAuthService: AsAuthServiceService = inject(AsAuthServiceService);
  private afAuth = inject(AngularFireAuth);

  private _currentUser = signal<UsuarioResponse | null>(null);

  private loggedInUser: Usuario | null = null;

  loginSuccess$: EventEmitter<void> = new EventEmitter<void>();
  logoutSuccess$: EventEmitter<void> = new EventEmitter<void>();

  public currentUser = computed(() => this._currentUser());

  public idCurrentUser: number | null = null;

  get currentUserValue(): UsuarioResponse | null {
    return this._currentUser();
  }

  async loginWithGooglePopPup() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account', // Forzar el selector de cuenta
    });

    const creds = await this.afAuth.signInWithPopup(provider);

    const idToken =
      creds.credential &&
      (creds.credential as firebase.auth.OAuthCredential).idToken;

    this.sendTokenToBackend(idToken as string);
  }

  private sendTokenToBackend(authToken: string): void {
    this.asAuthService.loginGoogle(authToken).subscribe({
      next: (response) => {
        const jwtToken = response.data.token;
        localStorage.setItem('token', jwtToken);

        // Decodificar el token y extraer la información del usuario
        const decodedToken: any = jwt_decode.jwtDecode(jwtToken);

        this.asAuthService.getUserInfo(jwtToken).subscribe({
          next: (user) => {
            this._currentUser.set(user.data);
            this.idCurrentUser = user.data.oidUsuario;
            const roles = user.data.roles.map((role) => role.nombre);
            localStorage.setItem('userRoles', JSON.stringify(roles));
          },
          error: (error) => {
            console.error(
              'Error al obtener la información del usuario:',
              error
            );
          },
        });

        this.loginSuccess$.emit();
      },
      error: (error) => {
        this.logout();
      },
    });
  }

  logout(): void {
    this.afAuth.signOut().then(() => {
      this.loggedInUser = null;
      // Limpiar el localStorage de los datos requeridos
      localStorage.removeItem('loggedInUser');
      localStorage.removeItem('token');

      // Emitir evento de logout
      this.logoutSuccess$.emit();
    });
  }

  getUserInfo() {
    return of(this._currentUser());
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
