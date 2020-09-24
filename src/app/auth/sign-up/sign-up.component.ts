import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SystemService } from 'src/app/services/system.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  _loadingStatus: boolean = false;
  _loadingStatus_Sub: Subscription;

  _formSubmited_Sub: Subscription;
  uploadFile_Sub: Subscription;
  errorOccured: boolean = false;
  errorMessage: string;
  errors: any;

  file: File;
  fileSelected: boolean = false;

  constructor(private _systemService: SystemService, private _authService: AuthService) { }

  ngOnInit(): void {
    this._systemService.loadingPageDataFalse();
    this._loadingStatus_Sub = this._systemService.getLoadingPageDataStatus().subscribe(
      res => {
        this._loadingStatus = res
      }
    );
  }

  onSubmit(form: NgForm) {
    let registerData = { ...form.value };
    this._systemService.loadingPageDataTrue();
    const formData = new FormData();
    formData.append('file', this.file);
    this.uploadFile_Sub = this._systemService.uploadFile(formData).subscribe(
      res => {
        registerData.profile_image = res.filePath;
        this._formSubmited_Sub = this._authService.signUp(registerData).subscribe(
          res => {
            this._systemService.loadingPageDataTrue();
            window.location.reload();
            // console.log("SignUpComponent == onSubmit == response = ", res);
          },
          err => {
            // console.log("SignUpComponent == onSubmit == error = ", err);
            this._systemService.loadingPageDataFalse();
            this.errorOccured = true;
            if (err.status == 404) {
              this.errorMessage = 'User Not Found, Invalid data entered.'
            }
            else {
              this.errorMessage = 'Server Error Occured, Refresh Page Try again.'
            }
            this.errors = err.errors;
          }
        );
      },
      err => {
        this._systemService.loadingPageDataFalse();
        this.errorOccured = true;
        this.errorMessage = 'Image Uploading Failed.'
      }
    );
  }

  onFileSelected(event) {
    if (event.target.files[0].type.match(/image\/*/ == null) || event.target.files[0].size > 2000000) {
      this._systemService.loadingPageDataFalse();
      this.errorOccured = true;
      this.errorMessage = 'Only image files supported, Max size 2MB.';
      this.file = null;
      this.fileSelected = false;
    } else {
      this.file = <File>event.target.files[0];
      this.fileSelected = true;
    }
  }

  uploadFile() {

  }

  ngOnDestroy(): void {
    if (this._loadingStatus_Sub) {
      this._loadingStatus_Sub.unsubscribe();
    }
  }
}
