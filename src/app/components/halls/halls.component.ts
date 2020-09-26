import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SystemService } from 'src/app/services/system.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HallDetailInterface } from 'src/app/interfaces/hall/hall-detail.interface';
import { HallManagerService } from 'src/app/services/hall-manager/hall-manager.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditHallComponent } from './edit-hall/edit-hall.component';
import { Router } from '@angular/router';

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
  private editItem_Sub: Subscription;
  private deleteItem_Sub: Subscription;

  constructor(
    private _systemService: SystemService,
    private _hallManagerService: HallManagerService,
    private _authService: AuthService,
    private _router: Router
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

  viewItem(hall: HallDetailInterface) {
    this._router.navigate(['halls', hall.id, 'view']);
  }

  editItem(hall: HallDetailInterface) {
    this._router.navigate(['halls', hall.id, 'edit']);
  }

  deleteItem(hall: HallDetailInterface) {
    if (confirm("do you want to delete this hall?")) {
      this.deleteItem_Sub = this._hallManagerService.deleteHall(hall.id).subscribe(
        res => {
          console.log("ManageHallsComponent == deleteHall == res = ", res);
          this.removeItemLocally(hall);
        },
        err => {
          console.log("ManageHallsComponent == deleteHall == err = ", err);
          alert("Error Occured, while removing hall.");
        }
      )
    }
    else {
      return;
    }
  }

  updateItemLocally(hall: HallDetailInterface) {
    let hallsCopy = this.halls.filter(el => el.id != hall.id);
    this.halls = hallsCopy;
  }

  removeItemLocally(hall: HallDetailInterface) {
    let hallsCopy = this.halls.filter(el => el.id != hall.id);
    this.halls = hallsCopy;
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
