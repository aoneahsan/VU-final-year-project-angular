export interface HallFeedbackInterface {
  id?;
  user_id?;
  hall_id?;
  booking_id?;
  user?: { id?; name?; email? };
  feedback?;
  rating?;
  created_at?;
}
