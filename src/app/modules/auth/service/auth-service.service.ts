import {
  computed,
  EventEmitter,
  inject,
  Injectable,
  OnDestroy,
  OnInit,
  signal,
  SimpleChange,
  WritableSignal,
} from '@angular/core';
import { AsAuthServiceService } from '../../../core/services/as-auth-service.service';
import { of, tap } from 'rxjs';
import { UsuarioResponse } from '../../../core/models/response/usuario-response.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as jwt_decode from 'jwt-decode';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import { MessagesInfoService } from '../../../shared/services/messages-info.service';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService implements OnInit {
  private asAuthService: AsAuthServiceService = inject(AsAuthServiceService);
  private messagesInfoService = inject(MessagesInfoService);
  private router = inject(Router);
  private afAuth = inject(AngularFireAuth);

  private _currentUser = signal<UsuarioResponse | null>(null);

  public loginSuccess$: WritableSignal<boolean | null> = signal(null);

  public currentUser = computed(() => this._currentUser());

  public idCurrentUser: number | null = null;

  get loginSuccess() {
    return this.loginSuccess$();
  }

  get currentUserValue(): UsuarioResponse | null {
    return this._currentUser();
  }

  ngOnInit(): void {
    //Verificar si el usuario ya está autenticado
    const token = localStorage.getItem('originalToken');
    this.sendTokenToBackend(token as string);
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

   sendTokenToBackend(authToken: string): void {
    this.asAuthService.loginGoogle(authToken).subscribe({
      next: (response) => {
        const jwtToken = response.data.token;
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('originalToken', authToken);

        this.getUserInfoByToken(jwtToken);
      },
      error: (error) => {
        this.logout();
      },
    });
  }

  async getUserInfoByToken(token: string) {
    await this.asAuthService.getUserInfo(token).subscribe({
      next: (user) => {
        this._currentUser.set(user.data);
        this.idCurrentUser = user.data.oidUsuario;
        const roles = user.data.roles.map((role) => role.nombre);
        localStorage.setItem('userRoles', JSON.stringify(roles));
        this.loginSuccess$.update(() => true);
      },
      error: (error) => {
        this.messagesInfoService.showErrorMessage(
          error.error.mensaje,
          'Error'
        );
      },
    });
  }

  logout(): void {
    this.afAuth.signOut().then(() => {
      // Limpiar el localStorage de los datos requeridos
      localStorage.removeItem('loggedInUser');
      localStorage.removeItem('token');
      localStorage.removeItem('userRoles');
      localStorage.removeItem('originalToken');
      this._currentUser.set(null);
      this.loginSuccess$.update(() => false);
      this.router.navigate(['/auth/login']);
    });
  }

  getUserInfo() {
    const token = localStorage.getItem('originalToken');
    return of(this.getUserInfoByToken(token as string));
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
