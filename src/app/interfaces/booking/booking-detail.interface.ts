export interface BookingDetailInterface {
  id?;
  user_id?;
  hall_id?;
  user?: { id?; name?; email?; profile_image? };
  hall?: { id?; name?; description?, location? };
  event_type?;
  no_of_persons?;
  booking_date?;
  book_time_from?;
  book_time_to?;
  menu?;
  extra_features?;
  feedback_provided_at?;
  price?;
  status?;
  created_at?;
}
