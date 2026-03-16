import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

const KEY_USERID = 'mb_userid';
const KEY_USERNAME = 'mb_username';
const KEY_LOGGEDIN = 'mb_loggedin';

@Injectable({ providedIn: 'root' })
export class SessionService {

  private platformId = inject(PLATFORM_ID);
  private isBrowserEnv = isPlatformBrowser(this.platformId);

  private loggedInSubject = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedInSubject.asObservable();

  constructor() {
    // ✅ ONLY read localStorage in browser
    if (this.isBrowserEnv) {
      const loggedIn = localStorage.getItem(KEY_LOGGEDIN) === 'true';
      this.loggedInSubject.next(loggedIn);
    }
  }

  // =========================
  // ✅ LOGIN
  // =========================
  setLogin(userId: number, username: string): void {
    if (!this.isBrowserEnv) return;

    localStorage.setItem(KEY_USERID, userId.toString());
    localStorage.setItem(KEY_USERNAME, username);
    localStorage.setItem(KEY_LOGGEDIN, 'true');

    this.loggedInSubject.next(true);
  }

  // =========================
  // ✅ LOGOUT
  // =========================
  logout(): void {
    if (!this.isBrowserEnv) return;

    localStorage.removeItem(KEY_USERID);
    localStorage.removeItem(KEY_USERNAME);
    localStorage.removeItem(KEY_LOGGEDIN);

    this.loggedInSubject.next(false);
  }

  // =========================
  // ✅ STATUS
  // =========================
  isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }

  // =========================
  // ✅ USER INFO
  // =========================
  getUserId(): number {
    if (!this.isBrowserEnv) return 0;
    return Number(localStorage.getItem(KEY_USERID)) || 0;
  }

  getUsername(): string {
    if (!this.isBrowserEnv) return '';
    return localStorage.getItem(KEY_USERNAME) || '';
  }
}
