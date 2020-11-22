import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { BookingDetailInterface } from "src/app/interfaces/booking/booking-detail.interface";
import { BookingService } from "src/app/services/booking/booking.service";
import { Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-booking-feedback",
  templateUrl: "./booking-feedback.component.html",
  styleUrls: ["./booking-feedback.component.scss"],
})
export class BookingFeedbackComponent implements OnInit, OnDestroy {
  @Input() booking: BookingDetailInterface;

  processingHttpRequest: boolean = false;

  placeFeedback_Sub: Subscription;

  data = {
    feedback: "",
    rating: 0,
  };

  constructor(
    public activeModal: NgbActiveModal,
    private bookingService: BookingService,
    private _toastrService: ToastrService
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    this.processingHttpRequest = true;
    this.placeFeedback_Sub = this.bookingService
      .giveFeedback(this.booking.id, this.data)
      .subscribe(
        (res) => {
          console.log("BookingFeedbackComponent == onSubmit == res = ", res);
          this._toastrService.success(
            "Feedback Placed Successfully :]",
            "Request Success"
          );
          this.activeModal.dismiss();
        },
        (err) => {
          this._toastrService.error(
            "Something went wrong try again later",
            "Error Occured"
          );
          console.log("BookingFeedbackComponent == onSubmit == err = ", err);
          this.activeModal.dismiss();
        }
      );
  }

  ngOnDestroy() {
    if (this.placeFeedback_Sub) {
      this.placeFeedback_Sub.unsubscribe();
    }
  }
}
