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
  private toDisplay: boolean = false;
  private toScroll: boolean = false;
  private messages: any = [];
  private messagesStack: any = [];
  private sessionId: string = this.guid();
  private typingDelay: number = 750;
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

  guid(): string {
    const s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  /* Adds a user message and send query to agent.

  PARAMS
    none

  RETURN
    none
  */
  private sendMessage(): void {
    if (!Utils.isEmpty(this.userInput)) {

      this.addMessage({
        align: 'right',
        type: 'text',
        text: this.userInput
      });

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
  private addMessage(msg): void {
    this.messages.push(msg);
    this.toScroll = true
  }

  /* Adds messages in the stack of messages to be displayed.

  PARAMS
    msgs: array of messages to add to the stack

  RETURN
    none
  */
  private addToMessagesStack(msgs): void {
    this.messagesStack = this.messagesStack.concat(msgs.reverse());
    if (!this.toDisplay) {
      this.toDisplay = true;
      this.displayStack();
    }
  }

  /* Displays the stacked messages.

  PARAMS
    none

  RETURN
    none
  */
  private displayStack(): void {
    setTimeout(() => {
      if (this.messagesStack.length > 0) {
        this.addMessage(this.messagesStack.pop());
        this.displayStack();
      } else {
        this.toDisplay = false;
      }
    }, this.typingDelay);
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
      sessionId: this.sessionId,
      lang: 'en',
      query
    };

    this.http.post(url, body, { headers })
    .subscribe(raw => {
      this.addToMessagesStack(Parser.format(raw));
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
