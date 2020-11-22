import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SystemService } from "../system.service";

@Injectable({
  providedIn: "root",
})
export class BookingService {
  constructor(
    private _http: HttpClient,
    private _systemService: SystemService
  ) {}

  getPlacedBookings() {
    return this._http.get<any>(
        this._systemService.getApiRootURL() + `user/bookings`
    );
  }

  getBookingDetails(bookingId) {
    return this._http.get<any>(
        this._systemService.getApiRootURL() + `user/bookings/${bookingId}`
    );
  }

  getHallData(hallId, data) {
    return this._http.post<any>(
        this._systemService.getApiRootURL() + `user/bookings/halls/${hallId}`,
        data
    );
  }

  placeBooking(data) {
    return this._http.post<any>(
        this._systemService.getApiRootURL() + `user/bookings`,
        data
    );
  }

  giveFeedback(bookingId, data) {
    return this._http.post<any>(
        this._systemService.getApiRootURL() + `user/bookings/${bookingId}/feedback`,
        data
    );
  }
}
