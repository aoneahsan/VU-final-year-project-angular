import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { UserProfileInterface } from 'src/app/interfaces/user/user-profile.interface';
import { User } from 'src/app/models/auth/user-model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-profile-update-modal',
  templateUrl: './profile-update-modal.component.html',
  styleUrls: ['./profile-update-modal.component.scss']
})
export class ProfileUpdateModalComponent implements OnInit, OnDestroy {

  @Input() user: UserProfileInterface;

  private updateUser_Sub: Subscription;
  private uploadFile_Sub: Subscription;
  private currentUserData_Sub: Subscription;

  requestSuccessfull: boolean = false;

  file: File;
  processingHttpRequest: boolean = false;

  currentUserData: User;


  constructor(
    public activeModal: NgbActiveModal,
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getLoggedInUserData();
  }

  getLoggedInUserData() {
    this.currentUserData_Sub = this.authService.getCurrentUserData().subscribe(
      res => {
        if (!!res) {
          this.currentUserData = res;
        }
      }
    );
  }

  // file uploading
  onFileSelected(selectedFile) {
    console.log(selectedFile.target.files[0].type.match(/image\/*/));
    if (selectedFile.target.files[0].size > 2000000) {
      alert("Max file size is 2MB.");
    }
    else {
      this.file = null;
      this.file = <File>selectedFile.target.files[0];
    }
  }

  onSubmit() {
    this.processingHttpRequest = true;
    const formData = new FormData();
    if (!!this.file) {
      formData.append('profile_image', this.file);
      console.log("this.file = ", this.file);
      this.updateProfileImage(formData);
    }
    else {
      this.updateProfile();
    }
  }

  updateProfileImage(data) {
    this.uploadFile_Sub = this.userService.updateProfileImage(data, this.user.id).subscribe(
      res => {
        this.updateProfile();
      },
      err => {
        alert("User profile image update failed");
        this.processingHttpRequest = false;
      }
    );
  }

  updateProfile() {
    this.updateUser_Sub = this.userService.editUserProfileData(this.user, this.user.id).subscribe(
      res => {
        console.log("ProfileUpdateModalComponent == editUserProfileData == res = ", res);
        this.user = res.data;
        alert("Profile Data Updated!");
        this.processingHttpRequest = false;
        this.activeModal.dismiss();
      },
      err => {
        console.log("ProfileUpdateModalComponent == editUserProfileData == err = ", err);
        alert("Error Occured while updating user data");
        this.processingHttpRequest = false;
      }
    );
  }

  ngOnDestroy() {
    if (this.updateUser_Sub) {
      this.updateUser_Sub.unsubscribe();
    }
    if (this.uploadFile_Sub) {
      this.uploadFile_Sub.unsubscribe();
    }
    if (this.currentUserData_Sub) {
      this.currentUserData_Sub.unsubscribe();
    }
  }
}
