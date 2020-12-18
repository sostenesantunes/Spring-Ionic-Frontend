import { AlertController } from 'ionic-angular';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { StorageService } from "../services/storage.service";
import { catchError, map } from 'rxjs/operators';
import { FieldMessage } from '../models/fieldmessage';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    public storage: StorageService,
    public alertController: AlertController) {
  }

    intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(req).pipe(
        map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                console.log('Event: ', event);
            }
            return event;
        }),
        catchError((error: HttpErrorResponse) => {

        let errorObj = error;

        if (errorObj.error) {
          errorObj = errorObj.error;
        }

        if (!errorObj.status) {
          errorObj = JSON.parse(errorObj.toString());
        }
        console.log("Erro detectado pelo interceptor:");
        console.log(errorObj);
        console.log(errorObj.status);

        switch (errorObj.status) {
          case 403:
            this.handle401();
            break;
          case 403:
            this.handle403();
            break;
          case 422:
            this.handler422(errorObj);
            break;

            default:
              this.handleDefaultError(errorObj);

        }

        return Observable.throw(errorObj);
      })) as any;
    }

    handle403() {
      this.storage.setLocalUser(null);
    }

    async handle401() {
      const alert = await this.alertController.create({
          title: 'Erro 401: Falha de autenticação',
          message: 'Email ou senha incorretos',
          enableBackdropDismiss: false,
          buttons: [
            {
              text: 'Ok'
            }
          ]
      });
      await alert.present();
  }

  handler422(errorObj) {
    let alert =  this.alertController.create({
      title: 'Error (422): Validação',
      message: this.listErrors(errorObj.errors),
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok'
        }
      ]
  });
   alert.present();

  }

  async handleDefaultError(errorObj) {
    const alert = await this.alertController.create({
        title: 'Erro ' + errorObj.status + ': ' + errorObj.error,
        message: errorObj.message,
        enableBackdropDismiss: false,
        buttons: [
          {
            text: 'Ok'
          }
        ]
    });
    await alert.present();
}
private listErrors(messages : FieldMessage[]) : string {
  let s : string = '';
  for (var i = 0; i < messages.length; i++) {
    s = s + '<p><strong>' + messages[i].fieldName + "</strong>: " + messages[i].message + '<p>';

  }
  return s;
}

}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,

}
