import { StorageService } from './storage.service';
import { LocalUser } from './../models/local_user';
import { HttpClient } from '@angular/common/http';
import { CredenciasDTO } from './../models/credencias.dto';
import { Injectable } from '@angular/core';
import { API_CONFIG } from '../config/api.config';
import { JwtHelper } from 'angular2-jwt';

@Injectable()
export class AuthService {

  jwtHelper: JwtHelper = new JwtHelper();

  constructor (public http: HttpClient, public storage: StorageService) {}

  autenticate(creds: CredenciasDTO) {
    return this.http.post(
      `${API_CONFIG.baseUrl}/login`,
      creds,
      {
        observe: 'response',
        responseType: 'text'
      });
  }

  successfulLogin(authorizationValue : string) {
      let tok = authorizationValue.substring(7);
      let user : LocalUser = {
        token: tok,
        email: this.jwtHelper.decodeToken(tok).sub

      };
      this.storage.setLocalUser(user);
  }

  logout() {
     this.storage.setLocalUser(null);
  }

}
