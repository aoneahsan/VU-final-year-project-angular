import { HallBookingInterface } from "./hall-booking.interface";
import { HallFeatureItem } from "./hall-feature-item.interface";
import { HallFeedbackInterface } from "./hall-feedback.interface";
import { HallFoodItem } from "./hall-food-item.interface";
import { HallGalleryItem } from "./hall-gallery-item.interface";
import { HallTimingInterface } from "./hall-timing.interface";
export interface HallDetailInterface {
  id?;
  name?;
  description?;
  hall_size?;
  event_type?;
  hall_rent?;
  location?;
  min_no_of_persons?;
  is_available?;
  open_time?;
  closed_time?;
  created_at?;
  images?: HallGalleryItem[];
  food_items?: HallFoodItem[];
  features?: HallFeatureItem[];
  timings?: HallTimingInterface[];
  feedbacks?: HallFeedbackInterface[];
  bookings?: HallBookingInterface[];
}
