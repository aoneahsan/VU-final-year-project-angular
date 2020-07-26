import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, SubscriptionLike } from 'rxjs';
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

  // Subscriptions
  private deleteUserSub: Subscription;

  constructor(private _systemService: SystemService, private _adminService: AdminService) { }

  ngOnInit(): void {
    this._systemService.loadingPageDataTrue();
    this._loadingStatus_Sub = this._systemService.getLoadingPageDataStatus().subscribe(
      res => {
        this._loadingStatus = res
      }
    );

    this.getCustomers();
  }

  getCustomers() {
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

  onView(data: UserProfileInterface) {

  }

  onEdit(data: UserProfileInterface) {
    
  }

  onDelete(data: UserProfileInterface) {
    if (confirm("Do you want to delete this user?")) {
      this.deleteUserSub = this._adminService.deleteUser(data.id, 'customer').subscribe(
        res => {
          console.log("ManageCustomersComponent == onDelete == res = ", res);
          this.customers = res.data;
          this.getCustomers();
        },
        err => {
          console.log("ManageCustomersComponent == onDelete == err = ", err);
          alert("Error Occured, try again");
        }
      );
    }
    else {
      return;
    }
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
