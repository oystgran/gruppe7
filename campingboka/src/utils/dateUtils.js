export function isGuestActiveOnDate(guest, date) {
  const checkIn = new Date(guest.check_in);
  const checkOut = new Date(guest.check_out);
  const selected = new Date(date);

  checkIn.setHours(0, 0, 0, 0);
  checkOut.setHours(0, 0, 0, 0);
  selected.setHours(0, 0, 0, 0);

  return selected >= checkIn && selected < checkOut;
}
