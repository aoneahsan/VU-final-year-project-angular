export interface BookingDetailInterface {
    id,
    user_id,
    hall_id,
    user?: {id, name, email, profile_image},
    hall?: {id, name, description},
    event_type,
    no_of_persons,
    booking_time,
    menu,
    price,
    created_at
}