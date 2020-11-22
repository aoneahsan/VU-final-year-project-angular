import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

import { SystemService } from "src/app/services/system.service";
import { BookingService } from "src/app/services/booking/booking.service";

import { BookingDetailInterface } from "src/app/interfaces/booking/booking-detail.interface";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BookingFeedbackComponent } from './booking-feedback/booking-feedback.component';

@Component({
  selector: "app-bookings",
  templateUrl: "./bookings.component.html",
  styleUrls: ["./bookings.component.scss"],
})
export class BookingsComponent implements OnInit, OnDestroy {
  _loadingStatus: boolean = false;
  _loadingStatus_Sub: Subscription;

  bookings: BookingDetailInterface[] = null;

  private getBookings_Sub: Subscription;

  constructor(
    private _systemService: SystemService,
    private _bookingService: BookingService,
    private _modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this._systemService.loadingPageDataFalse();
    this._loadingStatus_Sub = this._systemService
      .getLoadingPageDataStatus()
      .subscribe((res) => {
        this._loadingStatus = res;
      });
    this.getBookings();
  }

  getBookings() {
    this.getBookings_Sub = this._bookingService.getPlacedBookings().subscribe(
      (res) => {
        console.log("BookingsComponent == getBookings == res = ", res);
        this.bookings = res.data;
      },
      (err) => {
        console.log("BookingsComponent == getBookings == err = ", err);
      }
    );
  }

  giveFeedback(booking) {
    const modalRef = this._modalService.open(BookingFeedbackComponent);
    modalRef.componentInstance.booking = booking;
    modalRef.result.then(
      (result) => {
        if (result != "cancel" && result != "close") {
          // console.log("ChatUserComponent == openReportSpamModal == result = ", result);
        }
        this.getBookings();
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
    if (this.getBookings_Sub) {
      this.getBookings_Sub.unsubscribe();
    }
  }
}
