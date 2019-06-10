import { Component, ViewChild } from '@angular/core';
import * as json from '../../assets/json/experience.json';
import { ChatFormComponent } from '../components/chat-form/chat-form.component.js';
import { ChatFormInterface } from '../chat-engine/chat-form-interface.js';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements ChatFormInterface {
  
  form
  @ViewChild('chatForm') chatForm: ChatFormComponent

  constructor() {
    this.form = json['default'];
  }

  chatReady() {
    this.chatForm.setChatListener(this);
    this.chatForm.start();
  }

  callAction(action: any, formValues: any) {
    // Actions called here
    // throw new Error("Method not implemented.");
  }
  dropdownList(id: any, formValues: any): Promise<{ name: string; value: string; }[]> | import("rxjs").Observable<{ name: string; value: string; }[]> | { name: string; value: string; }[] {
    // Dropdown Lists done here
    throw new Error("Method not implemented.");
  }
  dropdownEmpty() {
    // Drop down empty event handled here
    throw new Error("Method not implemented.");
  }
}
