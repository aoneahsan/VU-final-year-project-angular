import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HallDetailInterface } from 'src/app/interfaces/hall/hall-detail.interface';
import { AdminService } from 'src/app/services/admin/admin.service';
import { SystemService } from 'src/app/services/system.service';

@Component({
  selector: 'app-manage-halls-approval',
  templateUrl: './manage-halls-approval.component.html',
  styleUrls: ['./manage-halls-approval.component.scss']
})
export class ManageHallsApprovalComponent implements OnInit, OnDestroy {

  _loadingStatus: boolean = false;
  _loadingStatus_Sub: Subscription;

  updateHall_Sub: Subscription;

  halls: HallDetailInterface[];
  private _halls_Sub: Subscription;

  constructor(private _systemService: SystemService, private _adminService: AdminService) { }

  ngOnInit(): void {
    this._systemService.loadingPageDataTrue();
    this._loadingStatus_Sub = this._systemService.getLoadingPageDataStatus().subscribe(
      res => {
        this._loadingStatus = res
      }
    );

    this._halls_Sub = this._adminService.getPendingApprovalHalls().subscribe(
      res => {
        this._systemService.loadingPageDataFalse();
        console.log("ManageHallsApprovalComponent == getAllHalls == res = ", res);
        this.halls = res.data;
      },
      err => {
        this._systemService.loadingPageDataFalse();
        console.log("ManageHallsApprovalComponent == getAllHalls == err = ", err);
      }
    );
  }

  updateHallStatus(hall, status: 'approve' | 'reject') {
    this._systemService.loadingPageDataTrue();
    let is_approved = null;
    if (status === 'approve') {
      is_approved = true;
    } else if (status === 'reject') {
      is_approved = false;
    }
    else {
      alert("Invalid Status!");
    }
    const data: HallDetailInterface = {
      id: hall.id,
      is_approved: is_approved
    };
    this.updateHall_Sub = this._adminService.updateHall(data).subscribe(
      res => {
        console.log("ManageHallsApprovalComponent == updateHallStatus == res = ", res);
        this._systemService.loadingPageDataFalse();
        this.removeHallLocally(hall);
      },
      err => {
        console.log("ManageHallsApprovalComponent == updateHallStatus == err = ", err);
        this._systemService.loadingPageDataFalse();
        alert("Error Occured, while updating hall status!");
      }
    )
  }

  removeHallLocally(hall) {
    const newHalls = this.halls.filter(el => el.id != hall.id);
    this.halls = newHalls;
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
