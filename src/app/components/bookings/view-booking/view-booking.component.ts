import { BookingDetailInterface } from "src/app/interfaces/booking/booking-detail.interface";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { SystemService } from "src/app/services/system.service";
import { BookingService } from "src/app/services/booking/booking.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { HallFoodItem } from "src/app/interfaces/hall/hall-food-item.interface";
import { HallFeatureItem } from "src/app/interfaces/hall/hall-feature-item.interface";
import { BookingFeedbackComponent } from '../booking-feedback/booking-feedback.component';
import { HallFeedbackInterface } from 'src/app/interfaces/hall/hall-feedback.interface';

@Component({
  selector: "app-view-booking",
  templateUrl: "./view-booking.component.html",
  styleUrls: ["./view-booking.component.scss"],
})
export class ViewBookingComponent implements OnInit, OnDestroy {
  _loadingStatus: boolean = false;
  private _loadingStatus_Sub: Subscription;

  _backendURL: string = null;

  private userData_Sub: Subscription;

  // Subscriptions
  private routeParamsSub: Subscription;
  private getBookingDataSub: Subscription;

  bookingDetails: BookingDetailInterface = null;
  food_items: HallFoodItem[];
  extra_features: HallFeatureItem[];
  booking_Feedback: HallFeedbackInterface;
  bookingDate;
  bookingId = null;
  loadingData: boolean = false;
  rating: number = 1;

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
    private _bookingService: BookingService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _toastrService: ToastrService,
    private _modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadingData = true;
    this._systemService.loadingPageDataFalse();
    this._loadingStatus_Sub = this._systemService
      .getLoadingPageDataStatus()
      .subscribe((res) => {
        this._loadingStatus = res;
      });

    this._backendURL = this._systemService.getBackendRootURL();

    this.routeParamsSub = this._route.paramMap.subscribe((res) => {
      if (res.has("bookingId")) {
        this.bookingId = res.get("bookingId");
        this.getBookingData(this.bookingId);
      } else {
        this._toastrService.error("Invalid Booking ID", "Invalid Data");
        this._router.navigate(["/"]);
      }
    });
  }

  getBookingData(id) {
    this.loadingData = true;
    this.getBookingDataSub = this._bookingService
      .getBookingDetails(id)
      .subscribe(
        (res) => {
          this.loadingData = false;
          console.log("ViewBookingComponent == getBookingData == res = ", res);
          if (!!res.data) {
            this.bookingDetails = res.data;
            this.food_items = res.food_items;
            this.extra_features = res.extra_features;
            this.booking_Feedback = res.booking_Feedback;
            const _date = new Date(this.bookingDetails.booking_date);
            this.bookingDate =
              _date.getFullYear() +
              "-" +
              _date.getMonth() +
              "-" +
              _date.getDate();
          }
        },
        (err) => {
          this.loadingData = false;
          console.log("ViewBookingComponent == getBookingData == err = ", err);
          this._toastrService.error(
            "Unable to fetch booking data :/",
            "Error Occured"
          );
        }
      );
  }

  giveFeedback(booking) {
    const modalRef = this._modalService.open(BookingFeedbackComponent);
    modalRef.componentInstance.booking = this.bookingDetails;
    modalRef.result.then(
      (result) => {
        if (result != "cancel" && result != "close") {
          // console.log("ChatUserComponent == openReportSpamModal == result = ", result);
        }
        this.getBookingData(this.bookingId);
      },
      (reason) => {
        // console.log(reason);
      }
    );
  }

  ngOnDestroy(): void {
    if (this._loadingStatus_Sub) {
      this._loadingStatus_Sub.unsubscribe();
    }
    if (this.getBookingDataSub) {
      this.getBookingDataSub.unsubscribe();
    }
  }
}
