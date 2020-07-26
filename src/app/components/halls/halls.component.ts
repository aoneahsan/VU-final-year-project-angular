import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SystemService } from 'src/app/services/system.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HallDetailInterface } from 'src/app/interfaces/hall/hall-detail.interface';
import { HallManagerService } from 'src/app/services/hall-manager/hall-manager.service';

@Component({
  selector: 'app-halls',
  templateUrl: './halls.component.html',
  styleUrls: ['./halls.component.scss']
})
export class HallsComponent implements OnInit, OnDestroy {

  _loadingStatus: boolean = false;
  _loadingStatus_Sub: Subscription;

  hallmanagerID;
  halls: HallDetailInterface[];

  // Subscriptions
  private _halls_Sub: Subscription;

  constructor(
    private _systemService: SystemService,
    private _hallManagerService: HallManagerService,
    private _authService: AuthService
  ) { }

  ngOnInit(): void {
    this._systemService.loadingPageDataTrue();
    this._loadingStatus_Sub = this._systemService.getLoadingPageDataStatus().subscribe(
      res => {
        this._loadingStatus = res
      }
    );

    this.hallmanagerID = this._authService.getUserID();

    this.getHalls(this.hallmanagerID);
  }

  getHalls(id) {
    this._halls_Sub = this._hallManagerService.getAllHalls().subscribe(
      res => {
        this._systemService.loadingPageDataFalse();
        console.log("ManageHallsComponent == getAllHalls == res = ", res);
        this.halls = res.data;
      },
      err => {
        this._systemService.loadingPageDataFalse();
        console.log("ManageHallsComponent == getAllHalls == err = ", err);
        alert("Error Occured, refresh page and try again.");
      }
    );
  }

  ngOnDestroy(): void {
    if (this._loadingStatus_Sub) {
      this._loadingStatus_Sub.unsubscribe();
    }
    if (this._halls_Sub) {
      this._halls_Sub.unsubscribe();
    }
  }
}
