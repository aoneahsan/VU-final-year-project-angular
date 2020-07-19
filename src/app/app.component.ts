import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'final-year-project-angular';

  constructor(private _authService: AuthService) { }

  ngOnInit() {
    this._authService.autoLogin();
  }
}
