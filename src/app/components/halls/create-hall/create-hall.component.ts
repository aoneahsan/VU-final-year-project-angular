import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SystemService } from 'src/app/services/system.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NgForm } from '@angular/forms';
import { HallManagerService } from 'src/app/services/hall-manager/hall-manager.service';

@Component({
  selector: 'app-create-hall',
  templateUrl: './create-hall.component.html',
  styleUrls: ['./create-hall.component.scss']
})
export class CreateHallComponent implements OnInit, OnDestroy {

  _loadingStatus: boolean = false;
  private _loadingStatus_Sub: Subscription;

  // Subscriptions
  private formSubmitSub: Subscription;


  formSubmited: boolean = false;

  constructor(
    private _systemService: SystemService,
    private _authService: AuthService,
    private _hallManagerService: HallManagerService,
    ) { }

  ngOnInit(): void {
    this._systemService.loadingPageDataFalse();
    this._loadingStatus_Sub = this._systemService.getLoadingPageDataStatus().subscribe(
      res => {
        this._loadingStatus = res
      }
    );
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.formSubmited = true;
      // console.log("onSubmit() data = ", form.value);
      this.formSubmitSub = this._hallManagerService.createHall(form.value).subscribe(
        res => {
          console.log("CreateHallComponent == ")
        }
      );
    }
    else {
      alert("Please Provide Valid Data.");
    }
  }

  ngOnDestroy(): void {
    if (this._loadingStatus_Sub) {
      this._loadingStatus_Sub.unsubscribe();
    }
  }
}
