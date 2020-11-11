import { HttpClient } from '@angular/common/http';
import { CredenciasDTO } from './../models/credencias.dto';
import { Injectable } from '@angular/core';
import { API_CONFIG } from '../config/api.config';

@Injectable()
export class AuthService {

  constructor (public http:HttpClient) {}

  autenticate(creds: CredenciasDTO) {
    return this.http.post(
      `${API_CONFIG.baseUrl}/login`,
      creds,
      {
        observe: 'response',
        responseType: 'text'
      });
  }

}
