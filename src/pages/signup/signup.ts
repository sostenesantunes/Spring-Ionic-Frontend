import { ClienteService } from './../../services/domain/cliente.service';
import { EstadoService } from './../../services/domain/estado.service';
import { CidadeService } from './../../services/domain/cidade.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { EstadoDTO } from '../../models/estado.dto';
import { CidadeDTO } from '../../models/cidade.dto.';


@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  formGroup: FormGroup;
  estados: EstadoDTO[];
  cidades: CidadeDTO[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public cidadeService: CidadeService,
    public estadoService: EstadoService,
    public clienteService: ClienteService,
    public alertController: AlertController) {

      // Inserção de dados manual, fase de desenvolvimento da aplicação.
      this.formGroup = this.formBuilder.group({
        nome: ['Paulo', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
        email: ['paulo@gmail.com', [Validators.required, Validators.email]],
        tipo: ['1', [Validators.required]],
        cpfOuCnpj: ['89003407002', [Validators.required, Validators.minLength(11), Validators.maxLength(14)]],
        senha: ['123456', [Validators.required]],
        logradouro: ['Rua Gonçalves Dias', [Validators.required]],
        numero: ['55', [Validators.required]],
        complemento: ['Apto 55', []],
        bairro: ['Pacaembú', []],
        cep: ['01234970', [Validators.required]],
        telefone1: ['976548155', [Validators.required]],
        telefone2: ['', []],
        telefone3: ['', []],
        estadoId: ['null', [Validators.required]],
        cidadeId: ['null', [Validators.required]]

      });
  }

  // O tratamento de erros será feito de forma global
  ionViewDidLoad() {
    this.estadoService.findAll().subscribe(response =>{
      this.estados = response;
      this.formGroup.controls.estadoId.setValue(this.estados[0].id);
      this.updateCidades();
    },
    error => {});


  }

  updateCidades(){
    let estado_id = this.formGroup.value.estadoId;
    this.cidadeService.findAll(estado_id).subscribe(response => {
      this.cidades = response;
      this.formGroup.controls.cidadeId.setValue(null);
    },
    error => {});
  }

  signupUser() {
    console.log();
    this.clienteService.insert(this.formGroup.value).subscribe(response => {
      this.showInsertOk();
    },
    error => {});

  }

  showInsertOk() {
    let alert = this.alertController.create({
      title: 'Sucesso!!!',
      message: 'Cadastro Realizado com sucesso.',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'ok',
          handler: () => {
            this.navCtrl.pop(); // A chamada do método Pop faz o desempilhamento de páginas.
          }
        }
      ]

    });
    alert.present(); // O método present mostra o conteúdo na tela
  }
}
