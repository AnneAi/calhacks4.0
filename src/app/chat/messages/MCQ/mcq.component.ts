import { Component, Input } from '@angular/core';

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

  checkAnswer(i: number): void {
    this.answered = true;
    this.studentAnswer = i;
    this.success = i == this.answer;
  }
}
