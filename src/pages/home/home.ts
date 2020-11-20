import { Component } from '@angular/core';
import { IonicPage, MenuController, NavController } from 'ionic-angular';
import { AuthService } from './../../services/auth.service';
import { CredenciasDTO } from './../../models/credencias.dto';
import { StorageService } from '../../services/storage.service';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  creds: CredenciasDTO = {
    email: "",
    senha: ""
  };

  constructor(
    public navCtrl: NavController,
     public menu: MenuController,
      public auth: AuthService,
      public storage: StorageService) {}


  ionViewWillEnter(){
    this.menu.swipeEnable(false);
  }

  ionViewDidLeave(){
   this.menu.swipeEnable(true);
  }

  ionViewDidEnter() {
    if (this.storage.getLocalUser() !== null) {
    this.auth.refreshToken()
    .subscribe(response => {
      this.auth.successfulLogin(response.headers.get('Authorization'));
      this.navCtrl.setRoot('CategoriasPage');
    },
      error => {});
   }
  }

  login() {
    this.auth.autenticate(this.creds).subscribe(response => {
      this.auth.successfulLogin(response.headers.get('Authorization'));
      this.navCtrl.setRoot('CategoriasPage');
    },
      error => {});

  }
}
