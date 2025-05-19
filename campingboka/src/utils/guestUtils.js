/*
  guestUtils.js
  --------------------------------------------------
  Utility function to populate a guest form with existing guest data:
    • Sets name, car number, and VIP status.
    • Attempts to match and normalize nationality from country list.
    • Ensures form fields are never set to undefined (fallbacks to empty strings).
    • Used in GuestModal.vue when selecting an existing guest from autocomplete.
*/
import { countries } from "@/tools/countries";

export function fillGuestForm(form, guest, vip = false) {
  form.name = guest.name || "";
  form.car_number = guest.car_number || "";
  form.vip = vip;

  const nationality = guest.nationality || "";
  const match = Object.values(countries).find(
    (c) => c.name.toLowerCase() === nationality.toLowerCase()
  );
  form.nationality = match ? match.name : "";
}
