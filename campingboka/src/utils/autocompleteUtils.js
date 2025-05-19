import { getIdTokenHeader } from "@/tools/firebaseToken";
import { countries } from "@/tools/countries";

export async function fetchGuestSuggestions(query, cb) {
  if (!query || query.trim().length < 1) return cb([]);
  try {
    const headers = await getIdTokenHeader();
    const res = await fetch(
      `/api/guests/search?query=${encodeURIComponent(query)}`,
      { headers }
    );
    const suggestions = await res.json();
    cb(
      suggestions.map((g) => ({
        value: `${g.name} (${g.car_number})`,
        guest: g,
        vip: g.vip === true,
      }))
    );
  } catch (err) {
    console.error("Error fetching guest suggestions:", err);
    cb([]);
  }
}

export async function fetchCarSuggestions(query, cb) {
  if (!query || query.trim().length < 1) return cb([]);
  try {
    const headers = await getIdTokenHeader();
    const res = await fetch(
      `/api/guests/search?query=${encodeURIComponent(query)}`,
      { headers }
    );
    const suggestions = await res.json();
    cb(
      suggestions.map((g) => ({
        value: `${g.car_number} (${g.name})`,
        guest: g,
        vip: g.vip === true,
      }))
    );
  } catch (err) {
    console.error("Error fetching car suggestions:", err);
    cb([]);
  }
}

export function queryNationalitySuggestions(queryString, cb) {
  const results = Object.entries(countries).filter(([code, { name }]) => {
    const lower = queryString.toLowerCase();
    return (
      code.toLowerCase().includes(lower) || name.toLowerCase().includes(lower)
    );
  });
  cb(results.map(([code, { name, flag }]) => ({ value: name, code, flag })));
}
