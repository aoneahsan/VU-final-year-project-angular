import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { HallDetailInterface } from "src/app/interfaces/hall/hall-detail.interface";
import { HallFeatureItem } from "src/app/interfaces/hall/hall-feature-item.interface";
import { HallManagerService } from "src/app/services/hall-manager/hall-manager.service";

@Component({
  selector: "app-add-hall-feature-item",
  templateUrl: "./add-hall-feature-item.component.html",
  styleUrls: ["./add-hall-feature-item.component.scss"],
})
export class AddHallFeatureItemComponent implements OnInit, OnDestroy {
  @Input() hallDetails: HallDetailInterface;
  @Input() hallFeatureItems: HallFeatureItem[];
  @Input() isCreating: boolean = false;
  @Input() FeatureItem: HallFeatureItem = {
    title: "",
    description: "",
    price: 0,
    is_available: false,
  };

  private createHallFeatureItem_Sub: Subscription;
  private updateHallFeatureItem_Sub: Subscription;

  requestSuccessfull: boolean = false;

  file: File;
  processingHttpRequest: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private _hallManagerService: HallManagerService
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    this.isCreating ? this.onCreateHallFeatureItem() : this.onUpdateHallFeatureItem();
  }

  onCreateHallFeatureItem() {
    this.createHallFeatureItem_Sub = this._hallManagerService
      .addHallFeatureItem(this.hallDetails.id, this.FeatureItem)
      .subscribe(
        (res) => {
          console.log(
            "AddHallFeatureItemComponent == onCreateHallFeatureItem == res = ",
            res
          );
          this.processingHttpRequest = false;
          this.hallFeatureItems.push(res.data);
          this.activeModal.dismiss();
        },
        (err) => {
          console.log(
            "AddHallFeatureItemComponent == onCreateHallFeatureItem == err = ",
            err
          );
          alert("Error Occured while creating item");
          this.processingHttpRequest = false;
        }
      );
  }

  onUpdateHallFeatureItem() {
    this.updateHallFeatureItem_Sub = this._hallManagerService
      .updateHallFeatureItem(this.hallDetails.id, this.FeatureItem)
      .subscribe(
        (res) => {
          console.log(
            "AddHallFeatureItemComponent == onUpdateHallFeatureItem == res = ",
            res
          );
          this.processingHttpRequest = false;
          const itemsCopy = this.hallFeatureItems.map((el) => {
            if (el.id == this.FeatureItem.id) {
              return res.data;
            } else {
              return el;
            }
          });
          this.hallFeatureItems = itemsCopy;
          this.activeModal.dismiss();
        },
        (err) => {
          console.log(
            "AddHallFeatureItemComponent == onUpdateHallFeatureItem == err = ",
            err
          );
          alert("Error Occured while updating item");
          this.processingHttpRequest = false;
        }
      );
  }

  ngOnDestroy() {
    if (this.updateHallFeatureItem_Sub) {
      this.updateHallFeatureItem_Sub.unsubscribe();
    }
    if (this.createHallFeatureItem_Sub) {
      this.createHallFeatureItem_Sub.unsubscribe();
    }
  }
}
