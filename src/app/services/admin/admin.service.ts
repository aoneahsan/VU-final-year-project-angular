// Core Imports
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Services
import { SystemService } from '../system.service';

// Interfaces
import { HallDetailInterface } from 'src/app/interfaces/hall/hall-detail.interface';
import { BookingDetailInterface } from 'src/app/interfaces/booking/booking-detail.interface';
import { UserProfileInterface } from 'src/app/interfaces/user/user-profile.interface';

@Injectable({
  providedIn: 'root'
})

export class AdminService {

  constructor(private _systemService: SystemService, private _http: HttpClient) { }

  // Users Functions
  getAllCustomers() {
    return this._http.get<any>(
      this._systemService.getApiRootURL() + 'admin/customers'
    );
  }

  getAllHallManagers() {
    return this._http.get<any>(
      this._systemService.getApiRootURL() + 'admin/hall_managers'
    );
  }

  getUser(id, type: 'customer' | 'hall_manager') {
    if (type == 'customer') {
      return this._http.get<UserProfileInterface>(
        this._systemService.getApiRootURL() + `admin/customers/${id}`
      );
    } else if (type == 'hall_manager') {
      return this._http.get<UserProfileInterface>(
        this._systemService.getApiRootURL() + `admin/hall_managers/${id}`
      );
    }
  }

  deleteUser(id, type: 'customer' | 'hall_manager') {
    if (type == 'customer') {
      return this._http.delete<any>(
        this._systemService.getApiRootURL() + `admin/customers/${id}`
      );
    } else if (type == 'hall_manager') {
      return this._http.delete<any>(
        this._systemService.getApiRootURL() + `admin/hall_managers/${id}`
      );
    }
  }

  // Halls Related Functions
  getAllHalls() {
    return this._http.get<any>(
      this._systemService.getApiRootURL() + 'admin/halls'
    );
  }

  getPendingApprovalHalls() {
    return this._http.get<any>(
      this._systemService.getApiRootURL() + 'admin/halls-pending-approval'
    );
  }

  getHall(id) {
    return this._http.get<HallDetailInterface>(
      this._systemService.getApiRootURL() + `admin/halls/${id}`
    );
  }

  updateHall(data: HallDetailInterface) {
    return this._http.post<HallDetailInterface>(
      this._systemService.getApiRootURL() + `admin/halls/${data.id}`,
      data
    );
  }

  deleteHall(id) {
    return this._http.delete<any>(
      this._systemService.getApiRootURL() + `admin/halls/${id}`
    );
  }

  // Bookings Related Functions
  getAllBookings() {
    return this._http.get<any>(
      this._systemService.getApiRootURL() + 'admin/bookings'
    );
  }

  getBooking(id) {
    return this._http.get<BookingDetailInterface>(
      this._systemService.getApiRootURL() + `admin/bookings/${id}`
    );
  }

  deleteBooking(id) {
    return this._http.delete<any>(
      this._systemService.getApiRootURL() + `admin/bookings/${id}`
    );
  }
}
