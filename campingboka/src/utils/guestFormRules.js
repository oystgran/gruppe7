/*
  createGuestFormRules.js
  --------------------------------------------------
  Validation rule generator for guest form (Element Plus):
    • Returns rule object used by `el-form` to validate guest input fields.
    • Includes standard required checks for name, car number, nationality, etc.
    • Custom validator ensures:
        – Check-out date is after check-in.
        – At least one adult or child is registered.
    • Depends on the `form` object passed in to validate cross-field logic.
    • Used in GuestModal.vue for validating form before submission.
*/

export function createGuestFormRules(form) {
  return {
    name: [{ required: true, message: "Please enter a name", trigger: "blur" }],
    car_number: [
      {
        required: true,
        message: "Please enter a car number",
        trigger: "blur",
      },
    ],
    nationality: [
      {
        required: true,
        message: "Please select a nationality",
        trigger: "blur",
      },
    ],
    check_in: [
      {
        required: true,
        message: "Please choose a check-in date",
        trigger: "change",
      },
    ],
    check_out: [
      {
        required: true,
        validator: (rule, value, callback) => {
          if (!value)
            return callback(new Error("Please select a check-out date"));

          if (!form || !form.check_in) {
            return callback(new Error("Check-in date is missing"));
          }

          const checkIn = new Date(form.check_in);
          const checkOut = new Date(value);

          if (checkOut <= checkIn) {
            return callback(new Error("Check-out must be after check-in"));
          }

          callback();
        },
        trigger: "change",
      },
    ],
    spotId: [
      {
        required: true,
        message: "Spot number is required",
        trigger: "change",
      },
    ],
    adults: [
      {
        required: true,
        validator: (rule, value, callback) => {
          if (form.adults === 0 && form.children === 0) {
            return callback(
              new Error("At least one adult or child is required")
            );
          }
          callback();
        },
        trigger: "change",
      },
    ],
  };
}
