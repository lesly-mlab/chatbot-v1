import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ChatBubbleComponent } from './chat-bubble/chat-bubble.component';
import { MomentModule } from 'angular2-moment';
import { CommonModule } from '@angular/common';
import { ChatFormComponent } from './chat-form/chat-form.component';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from './loader/loader';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    MomentModule,
    FormsModule
  ],
  declarations: [
    ChatBubbleComponent,
    ChatFormComponent,
    LoaderComponent
  ],
  exports: [
    ChatBubbleComponent,
    ChatFormComponent,
    LoaderComponent
  ]
})
export class ComponentsModule { } 