import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SystemService } from 'src/app/services/system.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HallDetailInterface } from 'src/app/interfaces/hall/hall-detail.interface';
import { AdminService } from 'src/app/services/admin/admin.service';

@Component({
  selector: 'app-manage-halls',
  templateUrl: './manage-halls.component.html',
  styleUrls: ['./manage-halls.component.scss']
})
export class ManageHallsComponent implements OnInit, OnDestroy {

  _loadingStatus: boolean = false;
  _loadingStatus_Sub: Subscription;

  availableHalls: HallDetailInterface[];
  private _halls_Sub: Subscription;

  constructor(private _systemService: SystemService, private _adminService: AdminService) { }

  ngOnInit(): void {
    this._systemService.loadingPageDataTrue();
    this._loadingStatus_Sub = this._systemService.getLoadingPageDataStatus().subscribe(
      res => {
        this._loadingStatus = res
      }
    );

    this._halls_Sub = this._adminService.getAllHalls().subscribe(
      res => {
        this._systemService.loadingPageDataFalse();
        console.log("ManageHallsComponent == getAllHalls == res = ", res);
        this.availableHalls = res.data;
      },
      err => {
        this._systemService.loadingPageDataFalse();
        console.log("ManageHallsComponent == getAllHalls == err = ", err);
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
