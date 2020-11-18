import { AlertController } from 'ionic-angular';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { StorageService } from "../services/storage.service";
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(public storage: StorageService, public alertController: AlertController) {
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
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,

}
