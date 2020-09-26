import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ProfileUpdateModalComponent } from 'src/app/components/user/profile-update-modal/profile-update-modal.component';
import { UserProfileInterface } from 'src/app/interfaces/user/user-profile.interface';
import { AdminService } from 'src/app/services/admin/admin.service';
import { SystemService } from 'src/app/services/system.service';

@Component({
  selector: 'app-manage-hall-managers',
  templateUrl: './manage-hall-managers.component.html',
  styleUrls: ['./manage-hall-managers.component.scss']
})

export class ManageHallManagersComponent implements OnInit, OnDestroy {

  _loadingStatus: boolean = false;
  _loadingStatus_Sub: Subscription;

  hallManagers: UserProfileInterface[];
  private _halls_Sub: Subscription;

  constructor(
    private _systemService: SystemService,
    private _adminService: AdminService,
    private _modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this._systemService.loadingPageDataTrue();
    this._loadingStatus_Sub = this._systemService.getLoadingPageDataStatus().subscribe(
      res => {
        this._loadingStatus = res
      }
    );

    this._halls_Sub = this._adminService.getAllHallManagers().subscribe(
      res => {
        this._systemService.loadingPageDataFalse();
        console.log("ManageHallsComponent == getAllHallManagers == res = ", res);
        this.hallManagers = res.data;
      },
      err => {
        this._systemService.loadingPageDataFalse();
        console.log("ManageHallsComponent == getAllHallManagers == err = ", err);
      }
    );
  }

  openUserUpdateModal(manager) {
    const modalRef = this._modalService.open(ProfileUpdateModalComponent);
    modalRef.componentInstance.user = manager;
    modalRef.result.then(
      (result) => {
        if (result != 'cancel' && result != 'close') {
          // console.log("ChatUserComponent == openReportSpamModal == result = ", result);
        }
      },
      (reason) => {
        // console.log(reason);
      });
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
