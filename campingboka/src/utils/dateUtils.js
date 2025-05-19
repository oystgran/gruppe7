/*
  isGuestActiveOnDate.js
  --------------------------------------------------
  Utility function to check if a guest is active on a specific date:
    • Normalizes check-in, check-out, and selected date to 00:00 for accurate comparison.
    • Returns true if selected date is:
        – On or after check-in.
        – Before check-out.
    • Used in MapScreen.vue to filter which guests should be displayed on a given day.
*/
export function isGuestActiveOnDate(guest, date) {
  const checkIn = new Date(guest.check_in);
  const checkOut = new Date(guest.check_out);
  const selected = new Date(date);

  checkIn.setHours(0, 0, 0, 0);
  checkOut.setHours(0, 0, 0, 0);
  selected.setHours(0, 0, 0, 0);

  return selected >= checkIn && selected < checkOut;
}
