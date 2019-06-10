import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ViewChild } from '@angular/core';
import { Message } from '../../models/message';
import { NavController } from '@ionic/angular';
import { ChatFormMessage } from 'src/app/chat-engine/chat-form-message';
import { TransportService } from 'src/app/services/transport-service';

@Component({
  selector: 'chat-bubble',
  templateUrl: './chat-bubble.component.html',
  styleUrls: ['./chat-bubble.component.scss']
})
export class ChatBubbleComponent implements OnInit {
  @Input() message: ChatFormMessage
  @Output() optionSelected: EventEmitter<any> = new EventEmitter();
  @ViewChild('messageContent') messageContent;
  selected = false

  constructor(private navCtrl: NavController, private transportService: TransportService) { }

  ngOnInit() {
    
  }

  date(timestamp) {
    return new Date(timestamp*1000)
  }

  optionChosen(option) {
    // this.message.type = 'sent'
    // this.message.from = 'sent',
    // this.message.message = option.name;

    console.log(option)
    this.optionSelected.next(option)
    this.selected = true
    // if (this.message.callback)
    //   this.message.callback(option)
  }

  fullScreenImage() {
    this.transportService.data = this.message.image
    this.navCtrl.navigateForward('/fullscreen-image')
  }

  ngOnChanges(changes: SimpleChanges) {
     if (changes['message']) {
      this.messageContent.nativeElement.innerHTML = this.message.content;
     }
  }

}
