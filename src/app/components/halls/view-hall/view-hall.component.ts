import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { AuthService } from "src/app/services/auth/auth.service";
import { HallManagerService } from "src/app/services/hall-manager/hall-manager.service";
import { SystemService } from "src/app/services/system.service";

import { User } from "src/app/models/auth/user-model";

import { HallDetailInterface } from "src/app/interfaces/hall/hall-detail.interface";
import { HallFeatureItem } from "./../../../interfaces/hall/hall-feature-item.interface";
import { HallFoodItem } from "./../../../interfaces/hall/hall-food-item.interface";
import { HallGalleryItem } from "./../../../interfaces/hall/hall-gallery-item.interface";

@Component({
  selector: "app-view-hall",
  templateUrl: "./view-hall.component.html",
  styleUrls: ["./view-hall.component.scss"],
})
export class ViewHallComponent implements OnInit, OnDestroy {
  _loadingStatus: boolean = false;
  private _loadingStatus_Sub: Subscription;

  _backendURL: string = null;

  private userData_Sub: Subscription;

  // Subscriptions
  private routeParamsSub: Subscription;
  private getHallDataSub: Subscription;
  private formSubmitSub: Subscription;
  private addHallImageSub: Subscription;
  private deleteHallImageSub: Subscription;
  private addHallFoodItemSub: Subscription;
  private updateHallFoodItemSub: Subscription;
  private deleteHallFoodItemSub: Subscription;
  private addHallFeatureItemSub: Subscription;
  private updateHallFeatureItemSub: Subscription;
  private deleteHallFeatureItemSub: Subscription;

  hall: HallDetailInterface = null;
  hallImages: HallGalleryItem[] = null;
  hallFoodItems: HallFoodItem[] = null;
  hallFeatureItems: HallFeatureItem[] = null;
  hallID = null;
  userData: User;
  formSubmited: boolean = false;
  processingHallGalleryRequest: boolean = false;

  constructor(
    private _systemService: SystemService,
    private _authService: AuthService,
    private _hallManagerService: HallManagerService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this._systemService.loadingPageDataFalse();
    this._loadingStatus_Sub = this._systemService
      .getLoadingPageDataStatus()
      .subscribe((res) => {
        this._loadingStatus = res;
      });

    this._backendURL = this._systemService.getBackendRootURL();

    this.getUserData();
    this.routeParamsSub = this._route.paramMap.subscribe((res) => {
      if (res.has("id")) {
        this.hallID = res.get("id");
        this.getHallData(this.hallID);
      }
    });
  }

  getUserData() {
    this.userData_Sub = this._authService.getCurrentUserData().subscribe(
      (res) => {
        console.log("EditHallComponent == getCurrentUserData == res = ", res);
        if (res) {
          this.userData = res;
        }
      },
      (err) => {
        console.log("EditHallComponent == getCurrentUserData == err = ", err);
      }
    );
  }

  getHallData(id) {
    this.getHallDataSub = this._hallManagerService.getHall(id).subscribe(
      (res) => {
        console.log("EditHallComponent == getHall == res = ", res);
        if (!!res.data) {
          this.hall = res.data.hall;
          this.hallImages = res.data.images;
          this.hallFoodItems = res.data.food_items;
          this.hallFeatureItems = res.data.features;
        }
      },
      (err) => {
        console.log("EditHallComponent == getHall == err = ", err);
      }
    );
  }

  onSubmit() {
    if (this.hall) {
      this.formSubmited = true;
      // console.log("onSubmit() data = ", form.value);
      this.formSubmitSub = this._hallManagerService
        .updateHall(this.hall)
        .subscribe(
          (res) => {
            console.log("EditHallComponent == onSubmit == res = ", res);
            this.formSubmited = false;
            this._router.navigate(["/halls"]);
          },
          (err) => {
            console.log("EditHallComponent == onSubmit == err = ", err);
            this.formSubmited = false;
          }
        );
    }
  }

  // file uploading
  onFileSelected(selectedFile) {
    console.log(selectedFile.target.files[0].type.match(/image\/*/));
    if (selectedFile.target.files[0].size > 2000000) {
      alert("Max file size is 2MB.");
    } else {
      const file: File = <File>selectedFile.target.files[0];
      this.addHallImage(file);
    }
  }

  addHallImage(file: File) {
    this.processingHallGalleryRequest = true;
    const formData = new FormData();
    if (!!file) {
      formData.append("file", file);
      this.addHallImageSub = this._hallManagerService
        .addHallImage(this.hall.id, formData)
        .subscribe(
          (res) => {
            console.log("ViewHallComponent == addHallImage == res = ", res);
            this.getHallData(this.hall.id);
          },
          (err) => {
            console.log("ViewHallComponent == addHallImage == err = ", err);
          }
        );
    } else {
      alert("Invalid Request, no file selected!");
    }
  }

  deleteHallImage(image: HallGalleryItem) {
    this.addHallImageSub = this._hallManagerService
      .deleteHallImage(this.hall.id, image.id)
      .subscribe(
        (res) => {
          console.log("ViewHallComponent == addHallImage == res = ", res);
          this.getHallData(this.hall.id);
          this.processingHallGalleryRequest = false;
        },
        (err) => {
          this.processingHallGalleryRequest = false;
          console.log("ViewHallComponent == addHallImage == err = ", err);
        }
      );
  }

  addHallFoodItem() {}

  editHallFoodItem(item: HallFoodItem) {}

  deleteHallFoodItem(item: HallFoodItem) {}

  addHallFeatureItem() {}

  editHallFeatureItem(item: HallFeatureItem) {}

  deleteHallFeatureItem(item: HallFeatureItem) {}

  ngOnDestroy(): void {
    if (this._loadingStatus_Sub) {
      this._loadingStatus_Sub.unsubscribe();
    }
    if (this.userData_Sub) {
      this.userData_Sub.unsubscribe();
    }
    if (this.routeParamsSub) {
      this.routeParamsSub.unsubscribe();
    }
    if (this.formSubmitSub) {
      this.formSubmitSub.unsubscribe();
    }
    if (this.getHallDataSub) {
      this.getHallDataSub.unsubscribe();
    }
    if (this.addHallImageSub) {
      this.addHallImageSub.unsubscribe();
    }
    if (this.deleteHallImageSub) {
      this.deleteHallImageSub.unsubscribe();
    }
    if (this.addHallFoodItemSub) {
      this.addHallFoodItemSub.unsubscribe();
    }
    if (this.updateHallFoodItemSub) {
      this.updateHallFoodItemSub.unsubscribe();
    }
    if (this.deleteHallFoodItemSub) {
      this.deleteHallFoodItemSub.unsubscribe();
    }
    if (this.addHallFeatureItemSub) {
      this.addHallFeatureItemSub.unsubscribe();
    }
    if (this.updateHallFeatureItemSub) {
      this.updateHallFeatureItemSub.unsubscribe();
    }
    if (this.deleteHallFeatureItemSub) {
      this.deleteHallFeatureItemSub.unsubscribe();
    }
  }
}
