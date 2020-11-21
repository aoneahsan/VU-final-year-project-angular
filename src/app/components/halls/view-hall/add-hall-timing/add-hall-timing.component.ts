import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { HallDetailInterface } from "src/app/interfaces/hall/hall-detail.interface";
import { HallTimingInterface } from "src/app/interfaces/hall/hall-timing.interface";
import { HallManagerService } from "src/app/services/hall-manager/hall-manager.service";

@Component({
  selector: "app-add-hall-timing",
  templateUrl: "./add-hall-timing.component.html",
  styleUrls: ["./add-hall-timing.component.scss"],
})
export class AddHallTimingComponent implements OnInit, OnDestroy {
  @Input() hallDetails: HallDetailInterface;
  @Input() isCreating: boolean = false;
  @Input() timing: HallTimingInterface = {
    start_time: "",
    end_time: "",
  };

  private createHallTiming_Sub: Subscription;
  private updateHallTiming_Sub: Subscription;

  requestSuccessfull: boolean = false;

  file: File;
  processingHttpRequest: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private _hallManagerService: HallManagerService
  ) {}

  ngOnInit(): void {}

  get validTime() {
    if (this.timing.start_time && this.timing.end_time) {
      if (this.timing.start_time < this.timing.end_time) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  onSubmit() {
    this.isCreating ? this.onCreateHallTiming() : this.onUpdateHallTiming();
    console.log("1");
  }

  onCreateHallTiming() {
    console.log("2");
    this.createHallTiming_Sub = this._hallManagerService
      .addHallTiming(this.hallDetails.id, this.timing)
      .subscribe(
        (res) => {
          console.log(
            "AddHallTimingComponent == onCreateHallTiming == res = ",
            res
          );
          this.processingHttpRequest = false;
          this.hallDetails.timings.push(res.data);
          this.activeModal.dismiss();
        },
        (err) => {
          console.log(
            "AddHallTimingComponent == onCreateHallTiming == err = ",
            err
          );
          alert("Error Occured while creating item");
          this.processingHttpRequest = false;
        }
      );
  }

  onUpdateHallTiming() {
    console.log("3");
    this.updateHallTiming_Sub = this._hallManagerService
      .updateHallTiming(this.hallDetails.id, this.timing)
      .subscribe(
        (res) => {
          console.log(
            "AddHallTimingComponent == onUpdateHallTiming == res = ",
            res
          );
          this.processingHttpRequest = false;
          const itemsCopy = this.hallDetails.timings.map((el) => {
            if (el.id == this.timing.id) {
              return res.data;
            } else {
              return el;
            }
          });
          this.hallDetails.timings = itemsCopy;
          this.activeModal.dismiss();
        },
        (err) => {
          console.log(
            "AddHallTimingComponent == onUpdateHallTiming == err = ",
            err
          );
          alert("Error Occured while updating item");
          this.processingHttpRequest = false;
        }
      );
  }

  ngOnDestroy() {
    if (this.updateHallTiming_Sub) {
      this.updateHallTiming_Sub.unsubscribe();
    }
    if (this.createHallTiming_Sub) {
      this.createHallTiming_Sub.unsubscribe();
    }
  }
}
