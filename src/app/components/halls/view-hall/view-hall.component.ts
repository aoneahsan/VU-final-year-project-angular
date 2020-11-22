import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { AuthService } from "src/app/services/auth/auth.service";
import { HallManagerService } from "src/app/services/hall-manager/hall-manager.service";
import { SystemService } from "src/app/services/system.service";

import { User } from "src/app/models/auth/user-model";

import { HallFoodItem } from "./../../../interfaces/hall/hall-food-item.interface";
import { HallDetailInterface } from "src/app/interfaces/hall/hall-detail.interface";
import { AddHallTimingComponent } from "./add-hall-timing/add-hall-timing.component";
import { HallBookingInterface } from "src/app/interfaces/hall/hall-booking.interface";
import { HallTimingInterface } from "./../../../interfaces/hall/hall-timing.interface";
import { HallFeedbackInterface } from "src/app/interfaces/hall/hall-feedback.interface";
import { HallGalleryItem } from "./../../../interfaces/hall/hall-gallery-item.interface";
import { HallFeatureItem } from "./../../../interfaces/hall/hall-feature-item.interface";
import { AddHallFoodItemComponent } from "./add-hall-food-item/add-hall-food-item.component";
import { AddHallFeatureItemComponent } from "./add-hall-feature-item/add-hall-feature-item.component";

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
  private deleteHallFoodItemSub: Subscription;
  private deleteHallFeatureItemSub: Subscription;
  private deleteHallTimingSub: Subscription;
  private updateHallBookingSub: Subscription;

  hall: HallDetailInterface = null;
  hallID = null;
  userData: User;
  formSubmited: boolean = false;
  processingHallGalleryRequest: boolean = false;
  processingHallFoodRequest: boolean = false;
  processingHallFeatureRequest: boolean = false;
  processingHallTimingRequest: boolean = false;
  processingHallBookingRequest: boolean = false;

  timeConvert(time) {
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? " AM" : " PM"; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(""); // return adjusted time or original string
  }

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
          this.hall = res.data;
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
            this.processingHallGalleryRequest = false;
            console.log("ViewHallComponent == addHallImage == res = ", res);
            this.getHallData(this.hall.id);
          },
          (err) => {
            this.processingHallGalleryRequest = false;
            console.log("ViewHallComponent == addHallImage == err = ", err);
          }
        );
    } else {
      alert("Invalid Request, no file selected!");
    }
  }

  deleteHallImage(image: HallGalleryItem) {
    this.processingHallGalleryRequest = true;
    this.addHallImageSub = this._hallManagerService
      .deleteHallImage(this.hall.id, image.id)
      .subscribe(
        (res) => {
          this.processingHallGalleryRequest = false;
          console.log("ViewHallComponent == deleteHallImage == res = ", res);
          this.getHallData(this.hall.id);
        },
        (err) => {
          this.processingHallGalleryRequest = false;
          console.log("ViewHallComponent == deleteHallImage == err = ", err);
        }
      );
  }

  addHallFoodItem() {
    this.processingHallFoodRequest = true;
    const modalRef = this._modalService.open(AddHallFoodItemComponent);
    modalRef.componentInstance.isCreating = true;
    modalRef.componentInstance.hallDetails = this.hall;
    modalRef.result.then(
      (result) => {
        this.processingHallFoodRequest = false;
        if (result != "cancel" && result != "close") {
          // console.log("ViewHallComponent == addHallFoodItem == result = ", result);
        }
      },
      (reason) => {
        this.processingHallFoodRequest = false;
        console.log(
          "ViewHallComponent == addHallFoodItem == reason = ",
          reason
        );
      }
    );
  }

  editHallFoodItem(item: HallFoodItem) {
    this.processingHallFoodRequest = true;
    const modalRef = this._modalService.open(AddHallFoodItemComponent);
    modalRef.componentInstance.isCreating = false;
    modalRef.componentInstance.foodItem = item;
    modalRef.componentInstance.hallDetails = this.hall;
    modalRef.result.then(
      (result) => {
        this.processingHallFoodRequest = false;
        if (result != "cancel" && result != "close") {
          // console.log("ViewHallComponent == editHallFoodItem == result = ", result);
        }
      },
      (reason) => {
        this.processingHallFoodRequest = false;
        console.log(
          "ViewHallComponent == editHallFoodItem == reason = ",
          reason
        );
      }
    );
  }

  deleteHallFoodItem(item: HallFoodItem) {
    this.processingHallFoodRequest = true;
    this.deleteHallFoodItemSub = this._hallManagerService
      .deleteHallFoodItem(this.hall.id, item)
      .subscribe(
        (res) => {
          this.processingHallFoodRequest = false;
          this.hall.food_items = this.hall.food_items.filter(
            (el) => el.id != item.id
          );
          // console.log("ViewHallComponent == deleteHallFoodItem == res = ", res);
        },
        (err) => {
          this.processingHallFoodRequest = false;
          console.log("ViewHallComponent == deleteHallFoodItem == err = ", err);
        }
      );
  }

  addHallFeatureItem() {
    this.processingHallFeatureRequest = true;
    const modalRef = this._modalService.open(AddHallFeatureItemComponent);
    modalRef.componentInstance.isCreating = true;
    modalRef.componentInstance.hallDetails = this.hall;
    modalRef.result.then(
      (result) => {
        this.processingHallFeatureRequest = false;
        if (result != "cancel" && result != "close") {
          // console.log("ViewHallComponent == addHallFeatureItem == result = ", result);
        }
      },
      (reason) => {
        this.processingHallFeatureRequest = false;
        console.log(
          "ViewHallComponent == addHallFeatureItem == reason = ",
          reason
        );
      }
    );
  }

  editHallFeatureItem(item: HallFeatureItem) {
    this.processingHallFeatureRequest = true;
    const modalRef = this._modalService.open(AddHallFeatureItemComponent);
    modalRef.componentInstance.isCreating = false;
    modalRef.componentInstance.FeatureItem = item;
    modalRef.componentInstance.hallDetails = this.hall;
    modalRef.result.then(
      (result) => {
        this.processingHallFeatureRequest = false;
        if (result != "cancel" && result != "close") {
          // console.log("ViewHallComponent == editHallFeatureItem == result = ", result);
        }
      },
      (reason) => {
        this.processingHallFeatureRequest = false;
        console.log(
          "ViewHallComponent == editHallFeatureItem == reason = ",
          reason
        );
      }
    );
  }

  deleteHallFeatureItem(item: HallFeatureItem) {
    this.processingHallFeatureRequest = true;
    this.deleteHallFeatureItemSub = this._hallManagerService
      .deleteHallFeatureItem(this.hall.id, item)
      .subscribe(
        (res) => {
          this.processingHallFeatureRequest = false;
          this.hall.features = this.hall.features.filter(
            (el) => el.id != item.id
          );
          // console.log(
          //   "ViewHallComponent == deleteHallFeatureItem == res = ",
          //   res
          // );
        },
        (err) => {
          this.processingHallFeatureRequest = false;
          console.log(
            "ViewHallComponent == deleteHallFeatureItem == err = ",
            err
          );
        }
      );
  }

  addHallTiming() {
    this.processingHallTimingRequest = true;
    const modalRef = this._modalService.open(AddHallTimingComponent);
    modalRef.componentInstance.isCreating = true;
    modalRef.componentInstance.hallDetails = this.hall;
    modalRef.result.then(
      (result) => {
        this.processingHallTimingRequest = false;
        if (result != "cancel" && result != "close") {
          // console.log("ViewHallComponent == addHallFeatureItem == result = ", result);
        }
      },
      (reason) => {
        this.processingHallTimingRequest = false;
        console.log(
          "ViewHallComponent == addHallFeatureItem == reason = ",
          reason
        );
      }
    );
  }

  editHallTiming(item: HallTimingInterface) {
    this.processingHallTimingRequest = true;
    const modalRef = this._modalService.open(AddHallTimingComponent);
    modalRef.componentInstance.isCreating = false;
    modalRef.componentInstance.timing = item;
    modalRef.componentInstance.hallDetails = this.hall;
    modalRef.result.then(
      (result) => {
        this.processingHallTimingRequest = false;
        if (result != "cancel" && result != "close") {
          // console.log("ViewHallComponent == editHallTimingItem == result = ", result);
        }
      },
      (reason) => {
        this.processingHallTimingRequest = false;
        console.log(
          "ViewHallComponent == editHallTimingItem == reason = ",
          reason
        );
      }
    );
  }

  deleteHallTimingItem(item: HallTimingInterface) {
    this.processingHallTimingRequest = true;
    this.deleteHallTimingSub = this._hallManagerService
      .deleteHallTiming(this.hall.id, item)
      .subscribe(
        (res) => {
          this.processingHallTimingRequest = false;
          this.hall.timings = this.hall.timings.filter(
            (el) => el.id != item.id
          );
          // console.log(
          //   "ViewHallComponent == deleteHallTimingItem == res = ",
          //   res
          // );
        },
        (err) => {
          this.processingHallTimingRequest = false;
          console.log(
            "ViewHallComponent == deleteHallTimingItem == err = ",
            err
          );
        }
      );
  }

  updateHallBooking(
    item: HallBookingInterface,
    status: "approved" | "disapproved"
  ) {
    this.processingHallBookingRequest = true;
    item.status = status;
    this.updateHallBookingSub = this._hallManagerService
      .updateBooking(this.hall.id, item)
      .subscribe(
        (res) => {
          this.processingHallBookingRequest = false;
          this.hall.bookings = this.hall.bookings.map((el) => {
            if (el.id == item.id) {
              return item;
            } else {
              return el;
            }
          });
        },
        (err) => {
          this.processingHallBookingRequest = false;
          console.log("ViewHallComponent == approveHallBooking == err = ", err);
        }
      );
  }

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
    if (this.deleteHallFoodItemSub) {
      this.deleteHallFoodItemSub.unsubscribe();
    }
    if (this.deleteHallFeatureItemSub) {
      this.deleteHallFeatureItemSub.unsubscribe();
    }
    if (this.deleteHallTimingSub) {
      this.deleteHallTimingSub.unsubscribe();
    }
    if (this.updateHallBookingSub) {
      this.updateHallBookingSub.unsubscribe();
    }
  }
}
