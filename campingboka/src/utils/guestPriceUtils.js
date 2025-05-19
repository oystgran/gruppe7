//Prices used for giving price estimates for receptionists.
export const BASE_PRICE = 340;
export const FJORD_EXTRA = 120;
export const ADULT_PRICE = 40;
export const CHILD_PRICE = 20;
export const ELECTRICITY_PRICE = 50;

//List of fjord spots. 1-19, 38-42.
export const FJORD_SPOTS = new Set([
  ...Array.from({ length: 19 }, (_, i) => i + 1),
  38,
  39,
  40,
  41,
  42,
]);

export function isFjordSpot(spotId) {
  return FJORD_SPOTS.has(spotId);
}

export function calculateNights(checkIn, checkOut) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

export function calculatePrice({
  spotId,
  adults,
  children,
  electricity,
  check_in,
  check_out,
}) {
  const nights = calculateNights(check_in, check_out);
  if (!nights) return 0;

  const base = BASE_PRICE + (isFjordSpot(spotId) ? FJORD_EXTRA : 0);
  return (
    nights *
    (base +
      adults * ADULT_PRICE +
      children * CHILD_PRICE +
      (electricity ? ELECTRICITY_PRICE : 0))
  );
}
