import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import * as CryptoJS from 'crypto-js'
import { jwtDecode, JwtPayload } from 'jwt-decode'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  secretKey: string = environment.crypto.crypto_key

  constructor() { }

  private encrypt(txt: string): string {
    return CryptoJS.AES.encrypt(txt, this.secretKey).toString();
  }

  private decrypt(txt: string) {
    return CryptoJS.AES.decrypt(txt, this.secretKey).toString(CryptoJS.enc.Utf8);
  }

  saveDataInStorage(key: string, value: string) {
    localStorage.setItem(key, this.encrypt(value));
  }

  getDataFromStorage(key: string) {
    let data = localStorage.getItem(key) || '';
    return this.decrypt(data);
  }

  deleteDataFromStorage(key: string) {
    localStorage.removeItem(key);
  }

  clearStorage() {
    localStorage.clear();
  }

  setTokenInLocalStorage(token: string) {
    localStorage.setItem("Bearer", token);
    const data: any = jwtDecode(token);
    console.log(data);
    this.saveDataInStorage('id', String(data.sub) || '');
    this.saveDataInStorage('user_name', data.aud as string || '');
    this.saveDataInStorage('role', data.role as string || 'USER');
    this.saveDataInStorage('can_add', String(data.can_add !== undefined ? data.can_add : true));
    this.saveDataInStorage('can_delete', String(data.can_delete !== undefined ? data.can_delete : false));
    this.saveDataInStorage('can_clear', String(data.can_clear !== undefined ? data.can_clear : false));
  }

  hasRole(role: string): boolean {
    return this.getDataFromStorage('role') === role;
  }

  canAdd(): boolean {
    return this.getDataFromStorage('can_add') === 'true' || this.hasRole('ADMIN');
  }

  canDelete(): boolean {
    return this.getDataFromStorage('can_delete') === 'true' || this.hasRole('ADMIN');
  }

  canClear(): boolean {
    return this.getDataFromStorage('can_clear') === 'true' || this.hasRole('ADMIN');
  }

  isLoggedIn(): boolean {
    const token: any = localStorage.getItem('Bearer');
    if (!token) {
      return false;
    }
    else {
      const decode = jwtDecode<JwtPayload>(token);
      const exp: number = Number(decode.exp);
      let expDate = new Date(exp * 1000);
      if (expDate >= new Date()) {
        return true
      }
      else {
        return false
      }
    }
  }
}
