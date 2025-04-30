<template>
  <div class="guest-modal">
    <div v-if="visible" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h2 style="margin-bottom: 20px">
          {{ mode === "add" ? "Add guest" : "Update guest" }} (Spot no.
          {{ form.spotId }})
        </h2>

        <el-form
          ref="guestForm"
          :model="form"
          :rules="formRules"
          label-position="left"
          @submit.prevent="handleSubmit"
          label-width="110px"
        >
          <el-form-item label="Name" prop="name">
            <template #label>
              <span>
                <span
                  v-if="hasValidationError('name')"
                  style="color: red; margin-right: 4px"
                  >*</span
                >
                Name
              </span>
            </template>
            <el-autocomplete
              v-model="form.name"
              :fetch-suggestions="debouncedGuestSearch"
              :trigger-on-focus="false"
              placeholder="Enter guest name"
              clearable
              @select="onGuestSelected"
            />
          </el-form-item>

          <el-form-item label="Car number" prop="car_number">
            <template #label>
              <span>
                <span
                  v-if="hasValidationError('car_number')"
                  style="color: red; margin-right: 4px"
                  >*</span
                >
                Car number
              </span>
            </template>
            <el-autocomplete
              v-model="form.car_number"
              :fetch-suggestions="debouncedCarSearch"
              placeholder="Enter car number"
              clearable
              :trigger-on-focus="false"
              @select="onCarSelected"
            />
          </el-form-item>

          <el-form-item label="Nationality" prop="nationality">
            <template #label>
              <span>
                <span
                  v-if="hasValidationError('nationality')"
                  style="color: red; margin-right: 4px"
                  >*</span
                >
                Nationality
              </span>
            </template>
            <el-autocomplete
              v-model="form.nationality"
              :fetch-suggestions="querySearch"
              placeholder="Select nationality"
              required
              clearable
              @blur="validateNationality"
            >
              <template v-slot="{ item }">
                <img
                  :src="item.flag"
                  alt="flag"
                  style="width: 20px; margin-right: 8px"
                />
                <span>{{ item.value }}</span>
              </template>
            </el-autocomplete>
          </el-form-item>

          <el-form-item label="Check-in" prop="check_in">
            <template #label>
              <span>
                <span
                  v-if="hasValidationError('check_in')"
                  style="color: red; margin-right: 4px"
                  >*</span
                >
                Check-in
              </span>
            </template>
            <el-date-picker
              v-model="form.check_in"
              type="datetime"
              placeholder="Choose check-in date"
              required
            />
          </el-form-item>

          <el-form-item prop="check_out">
            <template #label>
              <span>
                <span
                  v-if="hasValidationError('check_out')"
                  style="color: red; margin-right: 4px"
                  >*</span
                >
                Check-out
              </span>
            </template>
            <el-date-picker
              v-model="form.check_out"
              type="date"
              placeholder="Choose check-out date"
              required
            />
          </el-form-item>

          <el-form-item label="Spot" prop="spotId">
            <template #label>
              <span>
                <span v-if="!form.name" style="color: red; margin-right: 4px"
                  >*</span
                >
                Spot
              </span>
            </template>
            <div style="display: flex; align-items: center; margin-left: 12px">
              <el-input
                :value="form.spotId"
                disabled
                style="width: 100px; margin-left: 25px"
                input-style="text-align: center"
              />
              <span
                style="
                  opacity: 0.6;
                  font-size: 12px;
                  margin-left: 30px;
                  white-space: nowrap;
                "
              >
                {{
                  isFjordSpot
                    ? `Fjord spot + ${120 + 340}kr`
                    : `Standard spot + ${340}kr`
                }}
              </span>
            </div>
          </el-form-item>

          <el-form-item prop="adults">
            <template #label>
              <span>
                <span
                  v-if="hasValidationError('adults')"
                  style="color: red; margin-right: 4px"
                  >*</span
                >
                Adults
              </span>
            </template>
            <div style="display: flex; align-items: center; margin-left: 12px">
              <el-input-number
                v-model="form.adults"
                :min="0"
                :max="10"
                style="min-width: 100px"
              />
              <span
                style="
                  opacity: 0.6;
                  font-size: 12px;
                  white-space: nowrap;
                  margin-left: 12px;
                "
              >
                + {{ form.adults * 40 }} kr
              </span>
            </div>
          </el-form-item>

          <el-form-item prop="children">
            <template #label>
              <span>
                <span
                  v-if="hasValidationError('adults')"
                  style="color: red; margin-right: 4px"
                  >*</span
                >
                Children
              </span>
            </template>
            <div style="display: flex; align-items: center; margin-left: 12px">
              <el-input-number
                v-model="form.children"
                :min="0"
                :max="10"
                style="min-width: 100px"
              />
              <span
                style="
                  opacity: 0.6;
                  font-size: 12px;
                  white-space: nowrap;
                  margin-left: 12px;
                "
              >
                + {{ form.children * 20 }} kr
              </span>
            </div>
          </el-form-item>

          <el-form-item label="Electricity">
            <div style="display: flex; align-items: center; margin-left: 25px">
              <el-switch
                v-model="form.electricity"
                active-text="Yes"
                inactive-text="No"
              />
              <span
                style="
                  opacity: 0.6;
                  font-size: 12px;
                  white-space: nowrap;
                  margin-left: 50px;
                "
              >
                {{ form.electricity ? `+ ${50}kr` : "+ 0kr" }}
              </span>
            </div>
          </el-form-item>

          <el-form-item label="Price">
            <div style="display: flex; align-items: center; margin-left: 12px">
              <el-input-number
                v-model="form.price"
                :controls="false"
                :min="0"
                :disabled="true"
                class="price-field"
              />
            </div>
          </el-form-item>
        </el-form>

        <div
          style="
            text-align: right;
            font-size: 13px;
            opacity: 0.7;
            min-height: 20px;
            height: 20px;
            margin-top: -14px; /* justér om nødvendig for spacing */
            margin-bottom: 12px;
            margin-left: 60px;
            width: 100%;
            max-width: 350px;
            padding-right: 210px;
          "
        >
          <span :style="{ visibility: priceSummary ? 'visible' : 'hidden' }">
            {{ priceSummary }}
          </span>
        </div>

        <el-form-item v-if="mode === 'edit'">
          <div style="display: flex; gap: 20px">
            <el-button type="success" @click="handleSubmit">Update</el-button>
            <el-button type="danger" @click="handleDelete">Delete</el-button>
          </div>
        </el-form-item>

        <el-form-item v-else>
          <el-button
            type="primary"
            @click="handleSubmit"
            style="margin-left: 42px"
            >Add</el-button
          >
        </el-form-item>
      </div>
    </div>
  </div>
</template>

<script>
import { useStaysStore } from "@/stores/stays";
import { countries } from "@/tools/countries";
import dayjs from "dayjs";
import debounce from "lodash/debounce";

const BASE_PRICE = 340;
const FJORD_EXTRA = 120;
const ADULT_PRICE = 40;
const CHILD_PRICE = 20;
const ELECTRICITY_PRICE = 50;
const FJORD_SPOTS = new Set([
  ...Array.from({ length: 19 }, (_, i) => i + 1),
  38,
  39,
  40,
  41,
  42,
]);

export default {
  name: "GuestModal",
  props: {
    selectedDate: Date,
    visible: Boolean,
    initialSpotId: Number,
    guest: Object,
    mode: String, // 'add' or 'edit'
  },
  setup() {
    const store = useStaysStore();
    return { store };
  },
  data() {
    return {
      form: {
        name: "",
        car_number: "",
        nationality: "",
        price: 0,
        spotId: this.initialSpotId,
        adults: 0,
        children: 0,
        electricity: false,
        check_out: null,
      },
      formRules: {
        name: [
          { required: true, message: "Please enter a name", trigger: "blur" },
        ],
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
              const checkIn = new Date(this.form.check_in);
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
              if (this.form.adults === 0 && this.form.children === 0) {
                return callback(
                  new Error("At least one adult or child is required")
                );
              }
              callback();
            },
            trigger: "change",
          },
        ],
      },
    };
  },
  mounted() {
    if (!this.guest && this.mode === "add") {
      const dateToUse =
        this.selectedDate instanceof Date
          ? new Date(this.selectedDate)
          : new Date();
      const today = new Date();
      const isToday =
        dateToUse.getDate() === today.getDate() &&
        dateToUse.getMonth() === today.getMonth() &&
        dateToUse.getFullYear() === today.getFullYear();

      const checkIn = isToday
        ? new Date()
        : new Date(dateToUse.setHours(15, 0, 0, 0));

      this.form.check_in = checkIn;
    }
  },
  watch: {
    guest: {
      immediate: true,
      handler(newGuest) {
        if (this.mode === "edit" && newGuest) {
          this.form = {
            name: newGuest.name,
            car_number: newGuest.car_number,
            nationality: newGuest.nationality,
            price: Number(newGuest.price),
            spotId: newGuest.spotId || this.initialSpotId,
            check_in: new Date(newGuest.check_in),
            check_out: new Date(newGuest.check_out),
            adults: newGuest.adults || 1,
            children: newGuest.children || 0,
            electricity: newGuest.electricity ?? false,
          };
        }
      },
    },
    form: {
      handler() {
        this.calculatePrice();
      },
      deep: true,
    },
    initialSpotId(newSpotId) {
      if (this.mode === "add") {
        this.form.spotId = newSpotId;
      }
    },
  },
  selectedDate: {
    immediate: true,
    handler(newDate) {
      if (this.mode === "add" && newDate instanceof Date) {
        const checkIn = new Date(newDate);
        checkIn.setHours(15, 0, 0, 0);
        this.form.check_in = checkIn;
      }
    },
  },
  computed: {
    isFjordSpot() {
      return FJORD_SPOTS.has(this.form.spotId);
    },
    priceSummary() {
      const nights = this.calculateNights();
      if (!nights) return "";
      const nightlyRate =
        BASE_PRICE +
        (this.isFjordSpot ? FJORD_EXTRA : 0) +
        this.form.adults * ADULT_PRICE +
        this.form.children * CHILD_PRICE +
        (this.form.electricity ? ELECTRICITY_PRICE : 0);
      return `${nightlyRate} kr × ${nights} nights = ${
        nightlyRate * nights
      } kr`;
    },
  },
  created() {
    this.debouncedGuestSearch = debounce(this.fetchGuestSuggestions, 300);
    this.debouncedCarSearch = debounce(this.fetchCarSuggestions, 300);
  },
  methods: {
    hasValidationError(fieldName) {
      const field = this.$refs.guestForm?.fields?.find(
        (f) => f.prop === fieldName
      );
      const isInvalid = field?.validateState === "error";
      const isEmpty = !this.form[fieldName];
      return isInvalid || isEmpty;
    },
    async fetchCarSuggestions(query, cb) {
      if (!query || query.trim().length < 1) return cb([]);
      try {
        const res = await fetch(
          `/api/guests/search?query=${encodeURIComponent(query)}`
        );
        const suggestions = await res.json();
        cb(
          suggestions.map((g) => ({
            value: `${g.car_number} (${g.name})`,
            guest: g,
          }))
        );
      } catch (err) {
        console.error("Error fetching car number suggestions:", err);
        cb([]);
      }
    },
    async fetchGuestSuggestions(query, cb) {
      if (!query || query.trim().length < 1) return cb([]);

      try {
        const res = await fetch(
          `/api/guests/search?query=${encodeURIComponent(query)}`
        );
        const suggestions = await res.json();
        cb(
          suggestions.map((g) => ({
            value: `${g.name} (${g.car_number})`,
            guest: g,
          }))
        );
      } catch (err) {
        console.error("Error fetching suggestions:", err);
        cb([]);
      }
    },
    onGuestSelected(item) {
      if (!item || !item.guest) return;

      const guest = item.guest;
      console.log("Valgt gjest:", guest);

      this.form.name = guest.name || "";
      this.form.car_number = guest.car_number || "";

      const nationality = guest.nationality;
      console.log("Tidligere brukt nasjonalitet:", nationality);

      if (nationality) {
        const match = Object.values(countries).find(
          (c) => c.name.toLowerCase() === nationality.toLowerCase()
        );
        this.form.nationality = match ? match.name : "";
        console.log("Matchet nasjonalitet:", this.form.nationality);
      } else {
        this.form.nationality = "";
      }
    },

    onCarSelected(item) {
      if (!item || !item.guest) return;

      const guest = item.guest;

      this.form.name = guest.name || "";
      this.form.car_number = guest.car_number || "";

      const nationality = guest.nationality;
      if (nationality) {
        const match = Object.values(countries).find(
          (c) => c.name.toLowerCase() === nationality.toLowerCase()
        );
        this.form.nationality = match ? match.name : "";
      } else {
        this.form.nationality = "";
      }
    },
    isToday(date) {
      const today = new Date();
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    },
    calculateNights() {
      const checkIn = new Date(this.form.check_in);
      const checkOut = new Date(this.form.check_out);
      checkIn.setHours(0, 0, 0, 0);
      checkOut.setHours(0, 0, 0, 0);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      return nights > 0 ? nights : 0;
    },
    calculatePrice() {
      const nights = this.calculateNights();
      if (!nights) return (this.form.price = 0);
      const base = BASE_PRICE + (this.isFjordSpot ? FJORD_EXTRA : 0);
      const total =
        nights *
        (base +
          this.form.adults * ADULT_PRICE +
          this.form.children * CHILD_PRICE +
          (this.form.electricity ? ELECTRICITY_PRICE : 0));
      this.form.price = Number(total);
    },
    querySearch(queryString, cb) {
      const results = Object.entries(countries).filter(([code, { name }]) => {
        const lower = queryString.toLowerCase();
        return (
          code.toLowerCase().includes(lower) ||
          name.toLowerCase().includes(lower)
        );
      });
      cb(
        results.map(([code, { name, flag }]) => ({ value: name, code, flag }))
      );
    },
    validateNationality() {
      const valid = Object.values(countries).map((c) => c.name);
      if (!valid.includes(this.form.nationality)) this.form.nationality = "";
    },
    async handleSubmit() {
      this.$refs.guestForm.validate(async (valid) => {
        if (!valid) {
          this.$message.error("Please fix the errors before submitting.");
          return;
        }
        const checkOutDate = new Date(this.form.check_out);
        checkOutDate.setHours(12, 0, 0, 0);

        const guestPayload = {
          name: this.form.name,
          car_number: this.form.car_number,
          nationality: this.form.nationality,
        };

        const stayPayload = {
          spot_Id: this.form.spotId,
          check_in: dayjs(this.form.check_in).format("YYYY-MM-DDTHH:mm:ss"),
          check_out: dayjs(checkOutDate).format("YYYY-MM-DDTHH:mm:ss"),
          price: this.form.price,
          adults: this.form.adults,
          children: this.form.children,
          electricity: this.form.electricity,
        };

        try {
          if (this.mode === "edit") {
            console.log("Updating guest:", this.guest);
            console.log("guestId:", this.guest?.guestId);
            console.log("stayId:", this.guest?.stayId);

            await this.store.updateGuest(
              this.guest.guestId,
              guestPayload,
              this.guest.stayId,
              stayPayload
            );
          } else {
            await this.store.addGuest(guestPayload, stayPayload);
          }

          this.$message.success(this.mode === "edit" ? "Updated!" : "Added!");
          this.$emit("guestSaved"); // ✅ Bare én gang, etter alt er klart
          this.closeModal(); // ✅ Bare én gang, etterpå
        } catch (err) {
          console.error(err);
          this.$message.error("Something went wrong.");
        }
      });
    },
    async handleDelete() {
      try {
        await this.store.deleteGuest(this.guest.guestId, this.guest.stayId);
        this.$message.success("Guest deleted");
        this.$emit("guestSaved");
        this.closeModal();
      } catch (err) {
        console.error(err);
        this.$message.error("Deletion failed");
      }
    },
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}
.modal-content {
  position: relative;
  background: white;
  padding: 10px;
  border-radius: 8px;
  max-width: 90%;
  max-height: 90%;
  width: 500px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.modal-content .el-form {
  width: 300px;
}
.close {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 34px;
  font-weight: bold;
  cursor: pointer;
  padding: 8px 10px;
  color: black;
}
.close:hover {
  color: red;
}
/* ::v-deep(.el-form-item.is-required .el-form-item__label::before) {
  content: "*";
  color: red;
  position: absolute;
  left: -10px; 
  font-size: 16px;
} */

::v-deep(.el-form-item__label) {
  position: relative; /* 
  padding-right: 10px; */
}
::v-deep(.el-form-item__label::before) {
  display: none !important;
}
.modal-content .el-form {
  width: 100%;
  max-width: 350px; /* eller større hvis du ønsker mer plass */
}
.form-indent {
  margin-left: 12px;
}
</style>
