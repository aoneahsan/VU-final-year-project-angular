import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";

import { SystemService } from "src/app/services/system.service";
import { AuthService } from "src/app/services/auth/auth.service";
import { BookingService } from "src/app/services/booking/booking.service";
import { ToastrService } from "ngx-toastr";

import { HallDetailInterface } from "src/app/interfaces/hall/hall-detail.interface";
import { HallSlotInterface } from "./../../interfaces/hall-slot/hall-slot.interface";
import { BookingDetailInterface } from "src/app/interfaces/booking/booking-detail.interface";

@Component({
  selector: "app-book-hall",
  templateUrl: "./book-hall.component.html",
  styleUrls: ["./book-hall.component.scss"],
})
export class BookHallComponent implements OnInit, OnDestroy {
  _loadingStatus: boolean = false;
  private _loadingStatus_Sub: Subscription;

  userId;
  hallId;
  hallDetails: HallDetailInterface;
  bookedSlotsIds: number[];
  bookingData: BookingDetailInterface = {
    user_id: null,
    hall_id: null,
    event_type: "",
    no_of_persons: "",
    menu: [],
    extra_features: [],
    price: 0,
  };
  bookingSlotData: HallSlotInterface = {
    booking_id: null,
    hall_id: null,
    user_id: null,
    hall_time_id: null,
    date: "",
    is_active: true,
  };
  totalBookingPrice: number = 0;
  formSubmited: boolean = false;
  activeStep: number = 0; // 0 = date selection, 1 = enter booking details, 2 = success screen, 3 = error screen
  tomorrowDate;

  private routeParams_Sub: Subscription;
  private getHallDetail_Sub: Subscription;
  private placeBooking_Sub: Subscription;

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
    private _router: Router,
    private _route: ActivatedRoute,
    private _bookingService: BookingService,
    private _toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.tomorrowDate =
      new Date().getFullYear() +
      "-" +
      (+new Date().getMonth() + 1) +
      "-" +
      (+new Date().getDate() + 1);
    console.log("tomorrowDate = ", this.tomorrowDate);
    this._systemService.loadingPageDataFalse();
    this._loadingStatus_Sub = this._systemService
      .getLoadingPageDataStatus()
      .subscribe((res) => {
        this._loadingStatus = res;
      });

    this.userId = this._authService.getUserID();
    this.routeParams_Sub = this._route.paramMap.subscribe((res) => {
      if (res.has("hallId")) {
        this.hallId = res.get("hallId");
      } else {
        this._router.navigate(["search-halls"]);
        this._toastrService.error("Invalid Hall ID.", "Invalid Request");
      }
    });
  }

  saveBookingDate() {
    this.getHallDetails(this.hallId, () => {
      this.bookingData.booking_date = this.bookingSlotData.date;
      this.activeStep = 1; // seting active step to choose booking time
      this.totalBookingPrice += +this.hallDetails.hall_rent;
    });
  }

  getHallDetails(hallId, callBack?) {
    if (!hallId) {
      this._router.navigate(["search-halls"]);
    } else {
      const data = {
        date: this.bookingSlotData.date
      };
      this.getHallDetail_Sub = this._bookingService
        .getHallData(hallId, data)
        .subscribe(
          (res) => {
            console.log("BookHallComponent == getHallDetails == res = ", res);
            this.hallDetails = res.data;
            this.bookedSlotsIds = res.hallBookedSlots;
            if (
              this.hallDetails.timings &&
              this.hallDetails.timings.length < 1
            ) {
              this._toastrService.warning(
                "hall manager has not entered any timings from this hall yet, try again later.",
                "No Timing Added"
              );
            } else {
              callBack();
              this.checkIfEmptySlotsAvailable();
            }
          },
          (err) => {
            console.log("BookHallComponent == getHallDetails == err = ", err);
            this._toastrService.error(
              "Unable to fetch hall details right now, try again later",
              "Error Occured"
            );
          }
        );
    }
  }

  checkIfEmptySlotsAvailable() {
    return this.bookedSlotsIds.length < this.hallDetails.timings.length;
  }

  isTimeSlotBooked(timeId) {
    return this.bookedSlotsIds.includes(timeId);
  }

  saveBookingTime() {
    const time = this.hallDetails.timings.find(el => +el.id == +this.bookingSlotData.hall_time_id)
    this.bookingData.book_time_from = time.start_time;
    this.bookingData.book_time_to = time.end_time;
    this.activeStep = 2; // setting active step to select booking details
  }

  updateBookingPrice() {
    let hallRentPrice = +this.hallDetails.hall_rent;
    let bookingMenuPrice = 0;
    if (this.hallDetails.food_items && this.hallDetails.food_items.length > 0) {
      this.hallDetails.food_items.forEach((el) => {
        if (this.bookingData.menu.includes(el.id)) {
          bookingMenuPrice += +el.price;
        }
      });
    }
    let bookingExtraFeaturesPrice = 0;
    if (this.hallDetails.features && this.hallDetails.features.length > 0) {
      this.hallDetails.features.forEach((el) => {
        if (this.bookingData.extra_features.includes(el.id)) {
          bookingExtraFeaturesPrice += +el.price;
        }
      });
    }
    this.totalBookingPrice = +hallRentPrice + +bookingMenuPrice + +bookingExtraFeaturesPrice;
  }

  placeBookingRequest() {
    this.bookingData.user_id = +this.userId;
    this.bookingData.hall_id = +this.hallId;
    this.bookingSlotData.user_id = +this.userId;
    this.bookingSlotData.hall_id = +this.hallId;
    this.bookingData.price = +this.totalBookingPrice;
    const data = {
      bookingData: this.bookingData,
      bookingSlotData: this.bookingSlotData
    };
    this.placeBooking_Sub = this._bookingService
      .placeBooking(data)
      .subscribe(
        (res) => {
          console.log(
            "BookHallComponent == placeBookingRequest == res = ",
            res
          );
          this._toastrService.success("Booking Placed Successfully.", "Booked");
          this.activeStep = 3; // seting success message
        },
        (err) => {
          this.activeStep = 4; // seting error message
          console.log(
            "BookHallComponent == placeBookingRequest == err = ",
            err
          );
          this._toastrService.error(
            "Error Occured while placing Booking.",
            "Error Occured"
          );
        }
      );
  }

  goBack() {
    if (this.activeStep > 0) {
      this.activeStep--;
    }
  }

  ngOnDestroy(): void {
    if (this._loadingStatus_Sub) {
      this._loadingStatus_Sub.unsubscribe();
    }
    if (this.routeParams_Sub) {
      this.routeParams_Sub.unsubscribe();
    }
    if (this.getHallDetail_Sub) {
      this.getHallDetail_Sub.unsubscribe();
    }
    if (this.placeBooking_Sub) {
      this.placeBooking_Sub.unsubscribe();
    }
  }
}
