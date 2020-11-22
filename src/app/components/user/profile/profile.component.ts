import { Subscription } from "rxjs";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { UserProfileInterface } from "src/app/interfaces/user/user-profile.interface";
import { UserService } from "src/app/services/user/user.service";
import { AuthService } from "src/app/services/auth/auth.service";
import { SystemService } from "src/app/services/system.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ProfileUpdateModalComponent } from "../profile-update-modal/profile-update-modal.component";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit, OnDestroy {
  _loadingStatus: boolean = false;
  _loadingStatus_Sub: Subscription;

  currentUserData: UserProfileInterface;

  // Subscriptions
  private _userProfile_Sub: Subscription;
  private _editUserProfile_Sub: Subscription;
  private _deleteUserProfile_Sub: Subscription;

  constructor(
    private _userService: UserService,
    private _authService: AuthService,
    private _systemService: SystemService,
    private _modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this._systemService.loadingPageDataTrue();
    this._loadingStatus_Sub = this._systemService
      .getLoadingPageDataStatus()
      .subscribe((res) => {
        this._loadingStatus = res;
      });
    this.getUserData();
  }

  getUserData() {
    this._userProfile_Sub = this._userService.getUserProfileData().subscribe(
      (res) => {
        this._systemService.loadingPageDataFalse();
        console.log(
          "ProfileComponent == getUserProfileData == response = ",
          res
        );
        this.currentUserData = res.data;
      },
      (err) => {
        this._systemService.loadingPageDataFalse();
        console.log("ProfileComponent == getUserProfileData == error = ", err);
      }
    );
  }

  onDeleteAccount() {
    if (confirm("Do you want to delete your account?")) {
      this._systemService.loadingPageDataTrue();
      this._deleteUserProfile_Sub = this._userService
        .deleteUserAccount()
        .subscribe(
          (res) => {
            this._systemService.loadingPageDataFalse();
            this._authService.logout();
          },
          (err) => {
            this._systemService.loadingPageDataFalse();
            alert("Error Occured while deleting account.");
          }
        );
    } else {
      return;
    }
  }

  openUserUpdateModal(userData) {
    const modalRef = this._modalService.open(ProfileUpdateModalComponent);
    modalRef.componentInstance.user = userData;
    modalRef.result.then(
      (result) => {
        if (result != "cancel" && result != "close") {
          // console.log("ChatUserComponent == openReportSpamModal == result = ", result);
        }
        this.getUserData();
      },
      (reason) => {
        // console.log(reason);
        this.getUserData();
      }
    );
  }

  ngOnDestroy() {
    if (this._userProfile_Sub) {
      this._userProfile_Sub.unsubscribe();
    }
    if (this._editUserProfile_Sub) {
      this._editUserProfile_Sub.unsubscribe();
    }
    if (this._deleteUserProfile_Sub) {
      this._deleteUserProfile_Sub.unsubscribe();
    }
  }
}
