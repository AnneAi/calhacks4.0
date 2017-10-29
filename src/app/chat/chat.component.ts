import { Component, AfterViewChecked, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';

import { Utils } from '../../utils';
import { Parser } from './parser';
import { environment } from '../../environments/environment';
import { DialogFlowService } from '../services/dialog-flow.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: [ './chat.component.scss' ],
  providers: [ DialogFlowService ]
})
export class ChatComponent implements AfterViewChecked, OnInit, OnDestroy {

  @ViewChild('convTainer') private convTainer: ElementRef;
  private toDisplay: boolean = false;
  private toScroll: boolean = false;
  private messages: any = [];
  private messagesStack: any = [];
  private typingDelay: number = 750;
  private userInput = '';

  private subscription: Subscription;

  constructor(private dialogFlowService: DialogFlowService) { }

  ngOnInit(): void {
    this.subscription = this.dialogFlowService.subscribe((raw) => {
      this.addToMessagesStack(Parser.format(raw));
    });
  }

  ngAfterViewChecked() {
    if (this.toScroll) {
      try {
        this.convTainer.nativeElement.scrollTop = this.convTainer.nativeElement.scrollHeight;
      } catch(err) { }
      this.toScroll = false;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
    this.dialogFlowService.sendMessage(query);
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
