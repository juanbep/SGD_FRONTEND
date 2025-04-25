import { computed, inject, Injectable, OnInit, signal } from '@angular/core';
import { AsAuthServiceService } from '../../../core/services/as-auth-service.service';
import { UsuarioResponse } from '../../../core/models/response/usuario-response.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private asAuthService: AsAuthServiceService = inject(AsAuthServiceService);
  private router = inject(Router);
  private afAuth = inject(AngularFireAuth);

  private _currentUser = signal<UsuarioResponse | null>(null);

  public loginSuccess$ = signal<boolean>(false);

  public currentUser = computed(() => this._currentUser());

  public idCurrentUser: number | null = null;

  get loginSuccess() {
    return this.loginSuccess$();
  }

  get currentUserValue(): UsuarioResponse | null {
    return this._currentUser();
  }

  set currentUserValue(user: UsuarioResponse | null) {
    this._currentUser.set(user);
  }

  set updateLoginSuccess(value: boolean) {
    this.loginSuccess$.update(() => value);
  }

  async loginWithGooglePopPup(): Promise<string | void> {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account', // Forzar el selector de cuenta
    });

    const creds = await this.afAuth.signInWithPopup(provider);

    const idToken =
      creds.credential &&
      (creds.credential as firebase.auth.OAuthCredential).idToken;

    return idToken as string;
  }

  async sendTokenToBackend(authToken: string) {
    return await this.asAuthService.loginGoogle(authToken);
  }

  async getUserInfoFromBackend() {
    return await this.asAuthService.getUserInfo();
  }

  logout(): void {
    this.afAuth.signOut().then(() => {
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
    return this.asAuthService.getUserInfo();
  }
}
