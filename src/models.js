const supabase = require('./db');

async function getEvents() {
  const { data, error } = await supabase.from('events').select('*');
  if (error) throw error;
  return data;
}

async function getEventById(id) {
  const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

async function createEvent({ name, description, date, total_seats }) {
  const { data, error } = await supabase.from('events').insert({
    name,
    description,
    date,
    total_seats,
    available_seats: total_seats
  }).single();
  if (error) throw error;
  return data;
}

async function createUser({ email, name }) {
  const { data, error } = await supabase.from('users').insert({
    email,
    name
  }).single();
  if (error) throw error;
  return data;
}

async function getUserByEmail(email) {
  const { data, error } = await supabase.from('users').select('*').eq('email', email).single();
  if (error) return null;
  return data;
}

async function createBooking({ user_id, event_id, seats_booked }) {
  // Check availability first
  const event = await getEventById(event_id);
  if (!event) throw new Error('Event not found');
  if (event.available_seats < seats_booked) throw new Error('Not enough seats available');

  // Create booking
  const { data, error } = await supabase.from('bookings').insert({
    user_id,
    event_id,
    seats_booked
  }).single();
  if (error) throw error;

  // Update seats availability
  const { error: updateError } = await supabase.from('events')
    .update({ available_seats: event.available_seats - seats_booked })
    .eq('id', event_id);
  if (updateError) throw updateError;

  return data;
}

async function updateBooking({ booking_id, seats_booked }) {
  // Fetch booking
  const { data: booking, error: bookingError } = await supabase.from('bookings').select('*').eq('id', booking_id).single();
  if (bookingError) throw bookingError;

  const event = await getEventById(booking.event_id);
  if (!event) throw new Error('Event not found');

  // Calculate seat difference
  const diff = seats_booked - booking.seats_booked;
  if (diff > event.available_seats) throw new Error('Not enough seats available to increase');

  // Update booking seats
  const { data, error } = await supabase.from('bookings').update({ seats_booked }).eq('id', booking_id).single();
  if (error) throw error;

  // Update event seats availability
  const { error: updateError } = await supabase.from('events')
    .update({ available_seats: event.available_seats - diff })
    .eq('id', event.id);
  if (updateError) throw updateError;

  return data;
}

async function cancelBooking(booking_id) {
  // Fetch booking
  const { data: booking, error: bookingError } = await supabase.from('bookings').select('*').eq('id', booking_id).single();
  if (bookingError) throw bookingError;

  const event = await getEventById(booking.event_id);
  if (!event) throw new Error('Event not found');

  // Delete booking
  const { error } = await supabase.from('bookings').delete().eq('id', booking_id);
  if (error) throw error;

  // Update available seats
  const { error: updateError } = await supabase.from('events')
    .update({ available_seats: event.available_seats + booking.seats_booked })
    .eq('id', event.id);
  if (updateError) throw updateError;

  return true;
}

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  createUser,
  getUserByEmail,
  createBooking,
  updateBooking,
  cancelBooking
};
