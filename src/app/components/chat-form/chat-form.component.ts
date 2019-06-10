import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Message } from 'src/app/models/message';
import { ChatForm } from 'src/app/chat-engine/chat-form';
import { fromEvent, Observable, ConnectableObservable } from 'rxjs';
import { delay, publish } from 'rxjs/operators';
import { IonDatetime, IonSelect, Platform, NavController, Events } from '@ionic/angular';
import { ChatFormInterface } from 'src/app/chat-engine/chat-form-interface';
// import * as json from '../../../assets/json/insurance/funeral.json';
import * as moment from 'moment';

@Component({
  selector: 'chat-form',
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.scss']
})
export class ChatFormComponent implements OnInit {

  chatForm: ChatForm
  private title: String
  private result = {}
  list$;
  date
  time
  now
  value = ''

  @Input() listener: ChatFormInterface;
  @Input() form
  @Output() onInit: EventEmitter<any> = new EventEmitter()

  @ViewChild('editableDiv') editableDiv
  @ViewChild('bottomView') bottomView
  @ViewChild('datepicker') datepicker: IonDatetime;
  @ViewChild('timepicker') timepicker: IonDatetime;
  @ViewChild('dropdown') dropdown: IonSelect;
  height

  constructor(private platform: Platform, private navCtrl: NavController, private events: Events) { 
    this.platform.ready().then(() => {
      this.height = this.platform.height() - 150;
    })

    this.now = moment(new Date()).format('YYYY-MM-DD')
    this.date = moment(new Date()).format('YYYY-MM-DD')
    // this.datepicker.value = this.now
  }

  // initForm(json) {
  //   this.chatForm = new ChatForm(json)
  // }

  setChatListener(listener: ChatFormInterface) {
    this.chatForm.setListener(listener)
    this.chatForm.messageListener = this
  } 

  newMessage() {
    this.gotToBottom()
  }

  start() {
    this.chatForm.start()
    console.log(this.chatForm.messages)
  }

  gotToBottom() {
    setTimeout(() => {
      this.bottomView.nativeElement.scrollIntoView()
    })
  }

  ngOnInit() {
    this.chatForm = new ChatForm(this.form)
    this.onInit.next()
    // fromEvent(this.editableDiv.nativeElement, 'paste')
    //   .pipe(delay(10))
    //   .subscribe(() => {
    //     this.editableDiv.nativeElement.innerText = this.editableDiv.nativeElement.innerText
    //   })

      this.events.subscribe('newCameraPhoto', base64Photo => {
        this.chatForm.sendImage(base64Photo, true)
        this.gotToBottom()
      })

      this.events.subscribe('location', location => {
        const link = `https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=17&size=600x300&maptype=roadmap` +
        // "&markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:green%7Clabel:G%7C40.711614,-74.012318" +
        `&markers=color:red%7Clabel:L%7C${location.lat},${location.lng}` +
        "&key=AIzaSyBCnCPfmBgplyJw3fsk1bVzZIKaNZYCwSg"
        this.chatForm.sendMessage(`<img src="${link}" />`, true, location)
        this.gotToBottom()
        setTimeout(() => {
          this.gotToBottom
        }, 500)
        // this.chatForm.sendImage(base64Photo, true)
      })
  }

  ngOnDestroy() {
    this.events.unsubscribe('newCameraPhoto')
  }

  optionSelected(option) {
    console.log(option)
    this.chatForm.optionSelected(option)
  }

  dateChanged(date) {
    this.value = date.detail.value
    this.send()
    // this.editableDiv.nativeElement.innerText = date.detail.value
  }

  timeChanged(time) {
    this.value = time.detail.value
    this.send()
    // this.editableDiv.nativeElement.innerText = time.detail.value
  }

  newMessageClicked(event) {
    console.log(event)
    const message = this.chatForm.currentMessage
    if (message.type == 'question') {
      switch (message.fieldType) {
        case 'date':
          this.date = null
          this.datepicker.open();
          // this.editableDiv.nativeElement.innerText = this.date
          break;
        case 'time':
          this.time = null
          this.timepicker.open();
          // this.editableDiv.nativeElement.innerText = this.date
          break;
        case 'dropdown':
          this.list$ = this.chatForm.messageClicked()
          if (this.list$ instanceof Observable) {
            const con = this.list$.pipe(publish()) as ConnectableObservable<any>;
            const s = con.subscribe(list => {
              setTimeout(() => {
                if (list.length > 0) {
                  this.dropdown.open()
                } else {
                  this.chatForm.sendMessage('You have no policies')
                  // this.listener.dropdownEmpty()
                }
                
                // s.unsubscribe()
              }, 200)   
            })
            con.connect()
          }
          console.log(this.list$)
          break;
        case 'camera':
          this.navCtrl.navigateForward('/camera')
          break
        case 'location':
          this.navCtrl.navigateForward('/location-selector')
          break
      }

      if (message.fieldType != 'text') {
        event.stopPropagation()
      }
    }
    // if (question.type == 'date') {
    //   this.datepicker.open()
    // } else if (question.type == 'dropdown') {
    //   this.showDropdown(question.source)
    // }

    // if (question.type != 'text') {
    //   console.log('Propagation stopped')
    //   event.stopPropagation()
    // }
  // }
  }

  dropdownChanged(event) {
    const data = event.detail.value
    this.value = data.name
    // this.editableDiv.nativeElement.innerText = data.name
  }

  send() {
    let text: string = this.value.trim() // this.editableDiv.nativeElement.innerText.trim()

    if (text.length == 0)
      return

    if (this.chatForm.currentMessage.fieldType == 'dropdown') {
      this.chatForm.sendMessage(text, true, this.dropdown.value.value)
    } else {
      this.chatForm.sendMessage(text, true);
    }

    this.gotToBottom()
    this.datepicker.value = ''
    this.value = ''
    // this.editableDiv.nativeElement.innerText = ''
  }

  uploadImage(player) {
    console.log(player)
    // file.click()
    const supported = 'mediaDevices' in navigator;
    const constraints = {
      video: true,
    };
    navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
      player.srcObject = stream;
      console.log(stream)
    });

    console.log(supported)
  }

  previewImage(images) {
    

    
  }

}
