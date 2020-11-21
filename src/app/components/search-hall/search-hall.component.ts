import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { SystemService } from "src/app/services/system.service";
import { HallDetailInterface } from "src/app/interfaces/hall/hall-detail.interface";
import { UserService } from "src/app/services/user/user.service";
import { ActivatedRoute, Router } from "@angular/router";
import { HallBookingInterface } from "src/app/interfaces/hall/hall-booking.interface";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BookHallComponent } from "../book-hall/book-hall.component";

@Component({
  selector: "app-search-hall",
  templateUrl: "./search-hall.component.html",
  styleUrls: ["./search-hall.component.scss"],
})
export class SearchHallComponent implements OnInit, OnDestroy {
  _loadingStatus: boolean = false;
  _loadingStatus_Sub: Subscription;

  halls: HallDetailInterface[];
  private _hall_Sub: Subscription;
  private _routeParams_Sub: Subscription;

  constructor(
    private _systemService: SystemService,
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this._systemService.loadingPageDataTrue();
    this._loadingStatus_Sub = this._systemService
      .getLoadingPageDataStatus()
      .subscribe((res) => {
        this._loadingStatus = res;
      });

    const formData = new FormData();

    this._routeParams_Sub = this._route.queryParamMap.subscribe((params) => {
      if (
        params.has("name") ||
        params.has("minprice") ||
        params.has("maxprice") ||
        params.has("location") ||
        params.has("event_type") ||
        params.has("min_no_of_persons")
      ) {
        if (params.has("name")) {
          formData.set("name", params.get("name"));
        } else {
          formData.set("name", "");
        }
        if (params.has("minprice")) {
          let min_priceParam = +params.get("minprice");
          let min_price = min_priceParam > 0 ? min_priceParam : 0;
          formData.set("minprice", min_price.toString());
        } else {
          formData.set("minprice", "0");
        }
        if (params.has("maxprice")) {
          let max_priceParam = +params.get("maxprice");
          let max_price = max_priceParam > 0 ? max_priceParam : 0;
          formData.set("maxprice", max_price.toString());
        } else {
          formData.set("maxprice", "100000000000");
        }
        if (params.has("location")) {
          formData.set("location", params.get("location"));
        } else {
          formData.set("location", "");
        }
        if (params.has("event_type")) {
          formData.set("event_type", params.get("event_type"));
        } else {
          formData.set("event_type", "");
        }
        if (params.has("min_no_of_persons")) {
          formData.set("min_no_of_persons", params.get("min_no_of_persons"));
        } else {
          formData.set("min_no_of_persons", "0");
        }
        this.getHalls(formData);
      } else {
        this.getHalls(formData);
      }
    });
  }

  getHalls(data) {
    this._hall_Sub = this._userService.searchHalls(data).subscribe(
      (res) => {
        this._systemService.loadingPageDataFalse();
        console.log("SearchHallComponent == getUserBookings == res = ", res);
        this.halls = res.data;
        data = null;
      },
      (err) => {
        this._systemService.loadingPageDataFalse();
        console.log("SearchHallComponent == getUserBookings == err = ", err);
        data = null;
      }
    );
  }

  onSubmit(data) {
    let minPrice = data.minprice;
    if (minPrice < 0) {
      minPrice = 0;
    }
    let maxPrice = data.maxprice;
    if (maxPrice < 0) {
      maxPrice = 0;
    }
    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: {
        name: data.name,
        minprice: minPrice,
        maxprice: maxPrice,
        location: data.location,
        event_type: data.event_type,
        min_no_of_persons: data.min_no_of_persons,
      },
      queryParamsHandling: "merge",
    });

    data = null;
  }

  bookHall(item: HallBookingInterface) {
    this._router.navigate(["search-halls", item.id, "book"]);
  }

  ngOnDestroy(): void {
    if (this._loadingStatus_Sub) {
      this._loadingStatus_Sub.unsubscribe();
    }
    if (this._hall_Sub) {
      this._hall_Sub.unsubscribe();
    }
  }
}
