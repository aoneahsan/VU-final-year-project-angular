import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SystemService } from 'src/app/services/system.service';
import { HallDetailInterface } from 'src/app/interfaces/hall/hall-detail.interface';
import { UserService } from 'src/app/services/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search-hall',
  templateUrl: './search-hall.component.html',
  styleUrls: ['./search-hall.component.scss']
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
    private _router: Router
  ) { }

  ngOnInit(): void {
    this._systemService.loadingPageDataTrue();
    this._loadingStatus_Sub = this._systemService.getLoadingPageDataStatus().subscribe(
      res => {
        this._loadingStatus = res
      }
    );

    const formData = new FormData();

    this._routeParams_Sub = this._route.queryParamMap.subscribe(
      params => {
        if (
          params.has('name') || params.has('minprice') || params.has('maxprice') ||
          params.has('location') || params.has('event_type') || params.has('min_no_of_persons')
        ) {
          if (params.has('name')) {
            formData.set('name', params.get('name'));
          }
          else {
            formData.set('name', '');
          }
          if (params.has('minprice')) {
            formData.set('minprice', params.get('minprice'));
          }
          else {
            formData.set('minprice', '0');
          }
          if (params.has('maxprice')) {
            formData.set('maxprice', params.get('maxprice'));
          }
          else {
            formData.set('maxprice', '100000000000');
          }
          if (params.has('location')) {
            formData.set('location', params.get('location'));
          }
          else {
            formData.set('location', '');
          }
          if (params.has('event_type')) {
            formData.set('event_type', params.get('event_type'));
          }
          else {
            formData.set('event_type', '');
          }
          if (params.has('min_no_of_persons')) {
            formData.set('min_no_of_persons', params.get('min_no_of_persons'));
          }
          else {
            formData.set('min_no_of_persons', '0');
          }
          this.getHalls(formData);
        } else {
          this.getHalls(formData);
        }
      }
    );


  }

  getHalls(data) {
    this._hall_Sub = this._userService.searchHalls(data).subscribe(
      res => {
        this._systemService.loadingPageDataFalse();
        console.log("SearchHallComponent == getUserBookings == res = ", res);
        this.halls = res.data;
        data = null;
      },
      err => {
        this._systemService.loadingPageDataFalse();
        console.log("SearchHallComponent == getUserBookings == err = ", err);
        data = null;
      }
    );
  }

  onSubmit(data) {
    this._router.navigate(
      [],
      {
        relativeTo: this._route,
        queryParams: {
          name: data.name,
          minprice: data.minprice,
          maxprice: data.maxprice,
          location: data.location,
          event_type: data.event_type,
          min_no_of_persons: data.min_no_of_persons
        },
        queryParamsHandling: 'merge'
      });

      data = null;
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
