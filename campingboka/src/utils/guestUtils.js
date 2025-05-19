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
