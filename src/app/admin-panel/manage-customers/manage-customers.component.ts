import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SystemService } from 'src/app/services/system.service';
import { UserProfileInterface } from 'src/app/interfaces/user/user-profile.interface';
import { AdminService } from 'src/app/services/admin/admin.service';

@Component({
  selector: 'app-manage-customers',
  templateUrl: './manage-customers.component.html',
  styleUrls: ['./manage-customers.component.scss']
})
export class ManageCustomersComponent implements OnInit, OnDestroy {

  _loadingStatus: boolean = false;
  _loadingStatus_Sub: Subscription;

  customers: UserProfileInterface[];
  private _customers_Sub: Subscription;

  constructor(private _systemService: SystemService, private _adminService: AdminService) { }

  ngOnInit(): void {
    this._systemService.loadingPageDataTrue();
    this._loadingStatus_Sub = this._systemService.getLoadingPageDataStatus().subscribe(
      res => {
        this._loadingStatus = res
      }
    );

    this._customers_Sub = this._adminService.getAllCustomers().subscribe(
      res => {
        this._systemService.loadingPageDataFalse();
        console.log("ManageCustomersComponent == getAllCustomers == res = ", res);
        this.customers = res.data;
      },
      err => {
        this._systemService.loadingPageDataFalse();
        console.log("ManageCustomersComponent == getAllCustomers == err = ", err);
      }
    );
  }

  ngOnDestroy(): void {
    if (this._loadingStatus_Sub) {
      this._loadingStatus_Sub.unsubscribe();
    }
    if (this._customers_Sub) {
      this._customers_Sub.unsubscribe();
    }
  }
}
