import { Component, Input } from '@angular/core';

import { DialogFlowService } from '../../../services/dialog-flow.service';

@Component({
  selector: 'mcq-msg',
  templateUrl: './mcq.component.html',
  styleUrls: [ './mcq.component.scss' ]
})
export class MCQComponent {

  @Input() align: string;
  @Input() answer: number;
  @Input() choices: string[];
  @Input() explanation: string;
  @Input() wording: string;

  private answered: boolean = false;
  private studentAnswer: number;
  private success: boolean;

  constructor(private dialogFlowService: DialogFlowService) { }

  checkAnswer(i: number): void {
    this.answered = true;
    this.studentAnswer = i;
    this.success = i == this.answer;

    if (this.success) {
      this.dialogFlowService.sendMessage('get it');
    } else {
      this.dialogFlowService.sendMessage('get it');
    }
  }
}
