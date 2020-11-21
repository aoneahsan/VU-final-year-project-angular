import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";

import { HallManagerService } from "src/app/services/hall-manager/hall-manager.service";

import { HallDetailInterface } from "src/app/interfaces/hall/hall-detail.interface";
import { HallFoodItem } from "src/app/interfaces/hall/hall-food-item.interface";

@Component({
  selector: "app-add-hall-food-item",
  templateUrl: "./add-hall-food-item.component.html",
  styleUrls: ["./add-hall-food-item.component.scss"],
})
export class AddHallFoodItemComponent implements OnInit, OnDestroy {
  @Input() hallDetails: HallDetailInterface;
  @Input() isCreating: boolean = false;
  @Input() foodItem: HallFoodItem = {
    title: "",
    price: 0,
    is_available: false,
  };

  private createHallFoodItem_Sub: Subscription;
  private updateHallFoodItem_Sub: Subscription;

  requestSuccessfull: boolean = false;

  file: File;
  processingHttpRequest: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private _hallManagerService: HallManagerService
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    this.isCreating ? this.onCreateHallFoodItem() : this.onUpdateHallFoodItem();
    console.log("1");
  }

  onCreateHallFoodItem() {
    console.log("2");
    this.createHallFoodItem_Sub = this._hallManagerService
      .addHallFoodItem(this.hallDetails.id, this.foodItem)
      .subscribe(
        (res) => {
          console.log(
            "AddHallFoodItemComponent == onCreateHallFoodItem == res = ",
            res
          );
          this.processingHttpRequest = false;
          this.hallDetails.food_items.push(res.data);
          this.activeModal.dismiss();
        },
        (err) => {
          console.log(
            "AddHallFoodItemComponent == onCreateHallFoodItem == err = ",
            err
          );
          alert("Error Occured while creating item");
          this.processingHttpRequest = false;
        }
      );
  }

  onUpdateHallFoodItem() {
    console.log("3");
    this.updateHallFoodItem_Sub = this._hallManagerService
      .updateHallFoodItem(this.hallDetails.id, this.foodItem)
      .subscribe(
        (res) => {
          console.log(
            "AddHallFoodItemComponent == onUpdateHallFoodItem == res = ",
            res
          );
          this.processingHttpRequest = false;
          const itemsCopy = this.hallDetails.food_items.map((el) => {
            if (el.id == this.foodItem.id) {
              return res.data;
            } else {
              return el;
            }
          });
          this.hallDetails.food_items = itemsCopy;
          this.activeModal.dismiss();
        },
        (err) => {
          console.log(
            "AddHallFoodItemComponent == onUpdateHallFoodItem == err = ",
            err
          );
          alert("Error Occured while updating item");
          this.processingHttpRequest = false;
        }
      );
  }

  ngOnDestroy() {
    if (this.updateHallFoodItem_Sub) {
      this.updateHallFoodItem_Sub.unsubscribe();
    }
    if (this.createHallFoodItem_Sub) {
      this.createHallFoodItem_Sub.unsubscribe();
    }
  }
}
