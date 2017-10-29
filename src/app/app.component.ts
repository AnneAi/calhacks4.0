import { Component } from '@angular/core';

import { UuidService } from './services/uuid.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
  providers: [ UuidService ]
})
export class AppComponent { }
