import { AuthService } from './../../services/auth.service';
import { CredenciasDTO } from './../../models/credencias.dto';
import { Component } from '@angular/core';
import { IonicPage, MenuController, NavController } from 'ionic-angular';

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
      public auth: AuthService) {
  }

  ionViewWillEnter(){
    this.menu.swipeEnable(false);
  }

  ionViewDidLeave(){
   this.menu.swipeEnable(true);
  }

  login() {
    this.auth.autenticate(this.creds).subscribe(response =>{
      console.log(response.headers.get('Authorization'));
      this.navCtrl.setRoot('CategoriasPage');
    },
      error => {})

  }
}
