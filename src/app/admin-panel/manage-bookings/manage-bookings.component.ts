import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { SystemService } from "src/app/services/system.service";
import { BookingDetailInterface } from "src/app/interfaces/booking/booking-detail.interface";
import { AdminService } from "src/app/services/admin/admin.service";

@Component({
  selector: "app-manage-bookings",
  templateUrl: "./manage-bookings.component.html",
  styleUrls: ["./manage-bookings.component.scss"],
})
export class ManageBookingsComponent implements OnInit, OnDestroy {
  _loadingStatus: boolean = false;
  _loadingStatus_Sub: Subscription;

  bookings: BookingDetailInterface[];
  private _bookings_Sub: Subscription;

  constructor(
    private _systemService: SystemService,
    private _adminService: AdminService
  ) {}

  bookingDateFormat(booking: BookingDetailInterface) {
    if (booking.booking_date) {
      const _date = new Date(booking.booking_date);
      return _date.getFullYear() + "-" + _date.getMonth() + "-" + _date.getDate();
    }
    else {
      return null;
    }
  }

  ngOnInit(): void {
    this._systemService.loadingPageDataTrue();
    this._loadingStatus_Sub = this._systemService
      .getLoadingPageDataStatus()
      .subscribe((res) => {
        this._loadingStatus = res;
      });

    this._bookings_Sub = this._adminService.getAllBookings().subscribe(
      (res) => {
        this._systemService.loadingPageDataFalse();
        console.log("ManageHallsComponent == getAllHalls == res = ", res);
        this.bookings = res.data;
      },
      (err) => {
        this._systemService.loadingPageDataFalse();
        console.log("ManageHallsComponent == getAllHalls == err = ", err);
      }
    );
  }

  ngOnDestroy(): void {
    if (this._loadingStatus_Sub) {
      this._loadingStatus_Sub.unsubscribe();
    }
    if (this._bookings_Sub) {
      this._bookings_Sub.unsubscribe();
    }
  }
}
