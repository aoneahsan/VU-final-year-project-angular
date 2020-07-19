import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  userRole: 'admin'|'hall_manager'|'customer';
  userRole_Sub: Subscription;

  constructor(private _authService: AuthService) { }

  ngOnInit(): void {
    this.userRole_Sub = this._authService.getUserRole().subscribe(
      role => {
        console.log("Current Role = ", this.userRole, role);
        if (role) {
          this.userRole = role;
        }
      }
    );
  }

  logout() {
    this._authService.logout();
  }

  ngOnDestroy() {
    if (this.userRole_Sub) {
      this.userRole_Sub.unsubscribe();
    }
  }
}
