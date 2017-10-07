import { Component, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Utils } from '../../utils';
import { Parser } from './parser';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements AfterViewChecked {

  @ViewChild('convTainer') private convTainer: ElementRef;
  private toScroll: boolean = false;
  private messages: any = [];
  private userInput = '';

  constructor(private http: HttpClient) { }

  ngAfterViewChecked() {
    if (this.toScroll) {
      try {
        this.convTainer.nativeElement.scrollTop = this.convTainer.nativeElement.scrollHeight;
      } catch(err) { }
      this.toScroll = false;
    }
  } 

  /* Adds a user message and send query to agent.

  PARAMS
    none

  RETURN
    none
  */
  private sendMessage(): void {
    if (!Utils.isEmpty(this.userInput)) {

      this.addMessages([{
        align: 'right',
        type: 'text',
        text: this.userInput
      }]);

      this.sendMessageToAgent(this.userInput);

      this.userInput = '';
    }
  }

  /* Adds messages in the messages array.

  PARAMS
    msgs: array of messages to add

  RETURN
    none
  */
  private addMessages(msgs): void {
    this.messages = this.messages.concat(msgs);
    this.toScroll = true;
  }

  /* Sends a message to the agent.

  PARAMS
    query: string to send

  RETURN
    none
  */
  private sendMessageToAgent(query): void {
    let url = `${environment.apiai.queryUrl}?v=${environment.apiai.v}`;

    let headers = new HttpHeaders()
    .set('Authorization', `Bearer ${environment.apiai.key}`)
    .set('Content-Type', 'application/json; charset=utf-8');

    let body = {
      sessionId: 1,
      lang: 'en',
      query
    };

    this.http.post(url, body, { headers })
    .subscribe(raw => {
      this.addMessages(Parser.format(raw));
    },
    err => { });
  }

  /* Handles keyboard events.

  PARAMS
    event: keyboard event fired

  RETURN
    none
  */
  private handleKeyDown(event): void {
    if (event.keyCode === 13) {
      this.sendMessage();
    }
  }
}
