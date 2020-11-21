export interface HallBookingInterface {
  id?;
  user_id?;
  hall_id?;
  user?: { id?; name?; email? };
  event_type?;
  no_of_persons?;
  booking_time?;
  book_time_from?;
  book_time_to?;
  menu?;
  price?;
  status?: 'pending' | 'approved' | 'disapproved';
  created_at?;
}
