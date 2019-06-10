import { Component, Input, SimpleChanges } from '@angular/core';
// import {LoadingController, AlertController, ToastController} from 'ionic-angular'
import { Observable, ConnectableObservable, from } from 'rxjs';
import { publish } from 'rxjs/operators';
// import { from } from 'rxjs/observable/from';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';

/**
 * Generated class for the LoaderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'loader',
  templateUrl: 'loader.html'
})
export class LoaderComponent {
  @Input() process 
  @Input() success: string
  @Input() progress: string = 'Loading'
  @Input() dialog: Boolean = true
  @Input() handleErrors: Boolean = true
  @Input() empty: Boolean = false
  @Input() emptyMessage: string = 'No results found'

  public loading = false

  constructor(private loadingController: LoadingController, private toastController: ToastController,
    private alertController: AlertController) {
  }

  ngOnChanges(changes: SimpleChanges) { 
    this.empty = false
    
    if (this.process == null) {
      return 
    }
    if (changes['process']) {
      
      let loading = this.loadingController.create({
        message: this.progress
      })
      loading.then(loading => {
        if (this.dialog == true) { 
          loading.present()
        } else {
          this.loading = true
        }
        
      let observable
  
      if (this.process instanceof Observable) {
        observable = this.process
      } else {
        observable = from(this.process)
      }
      console.log(typeof(observable)) 
      
      let con = observable.pipe(publish()) as ConnectableObservable<any>
      con.subscribe(data => {
        console.log('Loading complete')
        loading.dismiss()
        this.loading = false
  
        if (this.success) {
          this.toastController.create({
            message: this.success,
            duration: 3000
          }).then(toast => {
            toast.present()
          })
        }
        if (data && data['empty'] == true) {
          this.empty = true
        }
      }, err => {
        loading.dismiss()
          if (!this.handleErrors)
            return new Promise((resolve, reject) => {
              reject(err)
            })
  
          let message = 'An unexpected error occurred'
  
          if (err.message) {
            message = err.message
          }
  
          this.alertController.create({
            header: 'Error',
            message: message,
            buttons: ['Ok']
          }).then(alert => {
            alert.present()
          })
      })
  
        
      con.connect()
      })

      
      
    }
  }

}
