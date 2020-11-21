import { HallTimingInterface } from "./../../interfaces/hall/hall-timing.interface";
// Core Imports
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

// Services
import { SystemService } from "../system.service";

// Interfaces
import { HallDetailInterface } from "src/app/interfaces/hall/hall-detail.interface";
import { HallFoodItem } from "src/app/interfaces/hall/hall-food-item.interface";
import { HallFeatureItem } from "src/app/interfaces/hall/hall-feature-item.interface";
import { HallBookingInterface } from "src/app/interfaces/hall/hall-booking.interface";

@Injectable({
  providedIn: "root",
})
export class HallManagerService {
  constructor(
    private _systemService: SystemService,
    private _http: HttpClient
  ) {}

  // Halls Related Functions
  getAllHalls() {
    return this._http.get<any>(
      this._systemService.getApiRootURL() + `hall-manager/halls`
    );
  }

  getHall(id) {
    return this._http.get<any>(
      this._systemService.getApiRootURL() + `hall-manager/halls/${id}`
    );
  }

  createHall(data: HallDetailInterface) {
    return this._http.post<any>(
      this._systemService.getApiRootURL() + `hall-manager/halls`,
      data
    );
  }

  updateHall(data: HallDetailInterface) {
    return this._http.post<any>(
      this._systemService.getApiRootURL() + `hall-manager/halls/${data.id}`,
      data
    );
  }

  deleteHall(id) {
    return this._http.delete<any>(
      this._systemService.getApiRootURL() + `hall-manager/halls/${id}`
    );
  }

  addHallImage(hallID, data) {
    return this._http.post<any>(
      this._systemService.getApiRootURL() +
        `hall-manager/halls/${hallID}/gallery`,
      data
    );
  }

  deleteHallImage(hallID, imageID) {
    return this._http.delete<any>(
      this._systemService.getApiRootURL() +
        `hall-manager/halls/${hallID}/gallery/${imageID}`
    );
  }

  addHallFoodItem(hallID, data) {
    return this._http.post<any>(
      this._systemService.getApiRootURL() + `hall-manager/halls/${hallID}/food`,
      data
    );
  }

  updateHallFoodItem(hallID, itemData: HallFoodItem) {
    return this._http.put<any>(
      this._systemService.getApiRootURL() +
        `hall-manager/halls/${hallID}/food/${itemData.id}`,
      itemData
    );
  }

  deleteHallFoodItem(hallID, itemData: HallFoodItem) {
    return this._http.delete<any>(
      this._systemService.getApiRootURL() +
        `hall-manager/halls/${hallID}/food/${itemData.id}`
    );
  }

  addHallFeatureItem(hallID, data) {
    return this._http.post<any>(
      this._systemService.getApiRootURL() +
        `hall-manager/halls/${hallID}/feature`,
      data
    );
  }

  updateHallFeatureItem(hallID, itemData: HallFeatureItem) {
    return this._http.put<any>(
      this._systemService.getApiRootURL() +
        `hall-manager/halls/${hallID}/feature/${itemData.id}`,
      itemData
    );
  }

  deleteHallFeatureItem(hallID, itemData: HallFeatureItem) {
    return this._http.delete<any>(
      this._systemService.getApiRootURL() +
        `hall-manager/halls/${hallID}/feature/${itemData.id}`
    );
  }

  addHallTiming(hallID, data) {
    return this._http.post<any>(
      this._systemService.getApiRootURL() + `hall-manager/halls/${hallID}/time`,
      data
    );
  }

  updateHallTiming(hallID, itemData: HallTimingInterface) {
    return this._http.put<any>(
      this._systemService.getApiRootURL() +
        `hall-manager/halls/${hallID}/time/${itemData.id}`,
      itemData
    );
  }

  deleteHallTiming(hallID, itemData: HallTimingInterface) {
    return this._http.delete<any>(
      this._systemService.getApiRootURL() +
        `hall-manager/halls/${hallID}/time/${itemData.id}`
    );
  }

  updateBooking(hallID: any, item: HallBookingInterface) {
    return this._http.put<any>(
      this._systemService.getApiRootURL() +
        `hall-manager/halls/${hallID}/booking/${item.id}`,
      item
    );
  }
}
