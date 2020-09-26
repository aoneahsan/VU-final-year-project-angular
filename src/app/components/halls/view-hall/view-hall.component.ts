import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { HallDetailInterface } from 'src/app/interfaces/hall/hall-detail.interface';
import { User } from 'src/app/models/auth/user-model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HallManagerService } from 'src/app/services/hall-manager/hall-manager.service';
import { SystemService } from 'src/app/services/system.service';

@Component({
  selector: 'app-view-hall',
  templateUrl: './view-hall.component.html',
  styleUrls: ['./view-hall.component.scss']
})
export class ViewHallComponent implements OnInit, OnDestroy {

  _loadingStatus: boolean = false;
  private _loadingStatus_Sub: Subscription;

  private userData_Sub: Subscription;

  // Subscriptions
  private routeParamsSub: Subscription;
  private getHallDataSub: Subscription;
  private formSubmitSub: Subscription;

  hall: HallDetailInterface = null;
  hallID = null;
  userData: User;
  formSubmited: boolean = false;

  constructor(
    private _systemService: SystemService,
    private _authService: AuthService,
    private _hallManagerService: HallManagerService,
    private _router: Router,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this._systemService.loadingPageDataFalse();
    this._loadingStatus_Sub = this._systemService.getLoadingPageDataStatus().subscribe(
      res => {
        this._loadingStatus = res
      }
    );

    this.getUserData();
    this.routeParamsSub = this._route.paramMap.subscribe(
      res => {
        if (res.has('id')) {
          this.hallID = res.get('id');
          this.getHallData(this.hallID);
        }
      }
    );
  }

  getUserData() {
    this.userData_Sub = this._authService.getCurrentUserData().subscribe(
      res => {
        console.log("EditHallComponent == getCurrentUserData == res = ", res);
        if (res) {
          this.userData = res;
        }
      },
      err => {
        console.log("EditHallComponent == getCurrentUserData == err = ", err);
      }
    );
  }

  getHallData(id) {
    this.getHallDataSub = this._hallManagerService.getHall(id).subscribe(
      res => {
        console.log("EditHallComponent == getHall == res = ", res);
        if (!!res.data) {
          this.hall = res.data;
        }
      },
      err => {
        console.log("EditHallComponent == getHall == err = ", err);
      }
    );
  }

  onSubmit() {
    if (this.hall) {
      this.formSubmited = true;
      // console.log("onSubmit() data = ", form.value);
      this.formSubmitSub = this._hallManagerService.updateHall(this.hall).subscribe(
        res => {
          console.log("EditHallComponent == onSubmit == res = ", res);
          this.formSubmited = false;
          this._router.navigate(['/halls']);
        },
        err => {
          console.log("EditHallComponent == onSubmit == err = ", err);
          this.formSubmited = false;
        }
      );
    }
  }

  ngOnDestroy(): void {
    if (this._loadingStatus_Sub) {
      this._loadingStatus_Sub.unsubscribe();
    }
    if (this.userData_Sub) {
      this.userData_Sub.unsubscribe();
    }
  }
}
