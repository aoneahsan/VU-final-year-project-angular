import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SystemService } from 'src/app/services/system.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit, OnDestroy {

  _loadingStatus: boolean = false;
  _loadingStatus_Sub: Subscription;

  constructor(private _systemService: SystemService, private _authService: AuthService) { }

  ngOnInit(): void {
    this._systemService.loadingPageDataFalse();
    this._loadingStatus_Sub = this._systemService.getLoadingPageDataStatus().subscribe(
      res => {
        this._loadingStatus = res
      }
    );
  }

  ngOnDestroy(): void {
    if (this._loadingStatus_Sub) {
      this._loadingStatus_Sub.unsubscribe();
    }
  }
}
