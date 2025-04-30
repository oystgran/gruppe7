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
          :model="form"
          label-width="90px"
          label-position="left"
          @submit.prevent="handleSubmit"
        >
          <el-form-item label="Name">
            <el-autocomplete
              v-model="form.name"
              :fetch-suggestions="debouncedGuestSearch"
              :trigger-on-focus="false"
              placeholder="Enter guest name"
              clearable
              @select="onGuestSelected"
            />
          </el-form-item>

          <el-form-item label="Car number">
            <el-autocomplete
              v-model="form.car_number"
              :fetch-suggestions="debouncedCarSearch"
              placeholder="Enter car number"
              clearable
              :trigger-on-focus="false"
              @select="onCarSelected"
            />
          </el-form-item>

          <el-form-item label="Nationality">
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

          <el-form-item label="Check-in">
            <el-date-picker
              v-model="form.check_in"
              type="datetime"
              placeholder="Choose check-in date"
              required
            />
          </el-form-item>

          <el-form-item label="Check-out">
            <el-date-picker
              v-model="form.check_out"
              type="date"
              placeholder="Choose check-out date"
              required
            />
          </el-form-item>

          <el-form-item label="Spot">
            <div style="display: flex; align-items: center">
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

          <el-form-item label="Adults">
            <div style="display: flex; align-items: center">
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

          <el-form-item label="Children">
            <div style="display: flex; align-items: center">
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
                  margin-left: 12px;
                "
              >
                {{ form.electricity ? `+ ${50}kr` : "+ 0kr" }}
              </span>
            </div>
          </el-form-item>

          <el-form-item label="Price">
            <div style="display: flex; align-items: center">
              <el-input-number
                v-model="form.price"
                :controls="false"
                :min="0"
                :disabled="true"
                class="price-field"
              />
            </div>

            <div
              v-if="priceSummary"
              style="
                text-align: right;
                font-size: 13px;
                opacity: 0.7;
                margin-top: 6px;
              "
            >
              {{ priceSummary }}
            </div>
          </el-form-item>
        </el-form>

        <el-form-item v-if="mode === 'edit'">
          <div style="display: flex; margin-left: 30px; gap: 20px">
            <el-button type="success" @click="handleSubmit">Update</el-button>
            <el-button type="danger" @click="handleDelete">Delete</el-button>
          </div>
        </el-form-item>

        <el-form-item v-else>
          <el-button
            type="primary"
            @click="handleSubmit"
            style="margin-left: 30px"
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
      this.form.name = item.guest.name;
      this.form.car_number = item.guest.car_number;
    },
    onCarSelected(item) {
      this.form.name = item.guest.name;
      this.form.car_number = item.guest.car_number;
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
</style>
