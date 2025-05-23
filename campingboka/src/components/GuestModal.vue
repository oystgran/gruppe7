<!--
  GuestModal.vue
  --------------------------------------------------
  Modal component for adding or updating guest bookings:
    • Displays a form for editing guest, spot, and stay details.
    • Autofills and validates inputs like name, car number, nationality, check-in/out, and pricing.
    • Calculates total price dynamically unless manually overridden.
    • Detects and proposes swaps or moves if the selected spot is already occupied.
    • Supports autocomplete suggestions and VIP recognition from previous stays.
    • Emits 'guestSaved' to refresh parent components after changes.
    • Handles creation, update, and deletion of guest and stay data.
    • Uses utility modules for price calculation, validation, and autocomplete logic.
-->
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
              <span style="display: flex; align-items: center; gap: 8px">
                <span v-if="hasValidationError('name')" style="color: red"
                  >*</span
                >
                Name
              </span>
            </template>

            <!-- Wrapp input og tag sammen -->
            <div style="position: relative; width: 100%">
              <el-autocomplete
                v-model="form.name"
                :fetch-suggestions="debouncedGuestSearch"
                :trigger-on-focus="false"
                placeholder="Enter guest name"
                clearable
                @select="onGuestSelected"
                style="width: 100%"
              />
              <el-tag
                v-if="form.vip"
                type="warning"
                effect="dark"
                size="small"
                style="
                  position: absolute;
                  right: 8px;
                  top: 50%;
                  transform: translateY(-50%);
                "
              >
                🌟 VIP
              </el-tag>
            </div>
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
              style="max-width: 166px; width: 100%"
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
              style="max-width: 166px; width: 100%"
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
              type="date"
              placeholder="Choose check-in date"
              required
              @change="setCheckInTime"
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
              <el-form-item label="" prop="spotId">
                <el-select
                  v-model="form.spotId"
                  placeholder="Select spot"
                  style="width: 120px"
                >
                  <el-option
                    v-for="id in availableSpots"
                    :key="id"
                    :label="getSpotLabel(id)"
                    :value="id"
                  />
                </el-select>
              </el-form-item>
              <span
                style="
                  opacity: 0.6;
                  font-size: 12px;
                  margin-left: 30px;
                  white-space: nowrap;
                "
              >
                {{
                  isFjordSpotComputed
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
                class="price-field"
                @input="priceManuallyEdited = true"
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
import { getIdTokenHeader } from "@/tools/firebaseToken";
import {
  calculatePrice,
  calculateNights,
  isFjordSpot,
} from "@/utils/guestPriceUtils";
import {
  fetchGuestSuggestions,
  fetchCarSuggestions,
  queryNationalitySuggestions,
} from "@/utils/autocompleteUtils";
import { createGuestFormRules } from "@/utils/guestFormRules";
import { fillGuestForm } from "@/utils/guestUtils";

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
      isVip: false,
      nameSelectedFromList: false,
      carSelectedFromList: false,
      skipNextSpotWatcher: false,
      priceManuallyEdited: false,
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
        vip: false,
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
    "form.spotId"(newVal, oldVal) {
      if (this.skipNextSpotWatcher) {
        this.skipNextSpotWatcher = false;
        return;
      }
      if (this.mode !== "edit" || newVal === oldVal) return;

      if (this.isSpotOccupied(newVal)) {
        // 🔁 SWAP
        const stay1Id = this.guest?.stayId;
        const stay2 = this.store.bookingsToday[newVal];
        if (!stay1Id || !stay2?.id) {
          this.$message.error("Could not find stays to swap.");
          this.form.spotId = oldVal;
          return;
        }

        this.$confirm(
          `Are you sure you want to swap:\n\n ${
            this.guest.car_number
          } (spot ${oldVal})\n with ${
            stay2.car_number
          } (spot ${newVal})\n\nFrom ${dayjs(this.selectedDate).format(
            "YYYY-MM-DD"
          )}?`,
          "Confirm Swap",
          {
            confirmButtonText: "Yes, move",
            cancelButtonText: "Cancel",
            type: "warning",
          }
        )
          .then(() => {
            this.handleSwapProposal(
              stay1Id,
              stay2.id,
              dayjs(this.selectedDate).format("YYYY-MM-DD")
            );
          })
          .catch(() => {
            this.$message.info("Swap cancelled.");
            this.skipNextSpotWatcher = true;
            this.form.spotId = oldVal;
          });
      } else {
        // 🛏️ MOVE to free spot
        this.$confirm(
          `Move ${
            this.guest.car_number
          } from spot ${oldVal} to ${newVal} starting ${dayjs(
            this.selectedDate
          ).format("YYYY-MM-DD")}?`,
          "Confirm Move",
          {
            confirmButtonText: "Yes, move",
            cancelButtonText: "Cancel",
            type: "warning",
          }
        )
          .then(() => {
            this.handleMoveProposal(
              this.guest.stayId,
              newVal,
              dayjs(this.selectedDate)
                .hour(14)
                .minute(0)
                .second(0)
                .format("YYYY-MM-DDTHH:mm:ss")
            );
          })
          .catch(() => {
            this.skipNextSpotWatcher = true;
            this.form.spotId = oldVal;
            this.$message.info("Move cancelled.");
          });
      }
    },
    "form.name"(newVal) {
      if (!newVal || !this.nameSelectedFromList) {
        this.isVip = false;
      }
      this.nameSelectedFromList = false;
    },
    "form.car_number"(newVal) {
      if (!newVal || !this.carSelectedFromList) {
        this.isVip = false;
      }
      this.carSelectedFromList = false;
    },
    guest: {
      immediate: true,
      handler(newGuest) {
        console.log("🔍 guest inn i GuestModal:", newGuest); // <-- LEGG TIL DENNE
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
            vip: "vip" in newGuest ? newGuest.vip : false,
          };
        }
      },
    },
    form: {
      handler() {
        if (!this.priceManuallyEdited) {
          this.form.price = calculatePrice({ ...this.form });
        }
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
    isFjordSpotComputed() {
      return isFjordSpot(this.form.spotId);
    },
    allSpots() {
      return Array.from({ length: 42 }, (_, i) => i + 1);
    },
    availableSpots() {
      const all = this.allSpots;
      const current = this.form.spotId;
      const withCurrent = new Set([...all, current]);
      return Array.from(withCurrent);
    },
    priceSummary() {
      const nights = calculateNights(this.form.check_in, this.form.check_out);
      if (!nights) return "";
      const total = calculatePrice({ ...this.form });
      return `${Math.round(
        total / nights
      )} kr × ${nights} nights = ${total} kr`;
    },
    formRules() {
      return createGuestFormRules(this.form);
    },
  },
  created() {
    this.debouncedGuestSearch = debounce(fetchGuestSuggestions, 600);
    this.debouncedCarSearch = debounce(fetchCarSuggestions, 600);
  },
  methods: {
    setCheckInTime(date) {
      if (date instanceof Date) {
        const withTime = new Date(date);
        withTime.setHours(15, 0, 0, 0); // Alltid 15:00
        this.form.check_in = withTime;
      }
    },
    async handleMoveProposal(stayId, newSpotId, fromDate) {
      try {
        const headers = await getIdTokenHeader();
        headers["Content-Type"] = "application/json";

        const res = await fetch("/api/stays/move", {
          method: "POST",
          headers,
          body: JSON.stringify({ stayId, newSpotId, fromDate }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Move failed");
        }

        this.$message.success("Guest moved successfully!");
        await this.store.loadGuests(this.selectedDate, true); // force reload
        this.$emit("guestSaved");
        this.closeModal();
      } catch (err) {
        console.error("Move error:", err);
        this.$message.error("Could not move guest.");
      }
    },
    async handleSwapProposal(stayId1, stayId2, fromDate) {
      try {
        const stay1 = this.guest;
        const stay2 = this.store.bookingsToday[this.form.spotId];

        if (!stay1 || !stay2) {
          this.$message.error("Could not find stays to swap.");
          return;
        }

        const headers = await getIdTokenHeader();
        headers["Content-Type"] = "application/json";

        // Utfør swap
        const res = await fetch("/api/stays/partial-swap", {
          method: "POST",
          headers,
          body: JSON.stringify({
            stay1: { id: stayId1 },
            stay2: { id: stay2.id },
            fromDate,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Swap failed");
        }

        await this.store.loadGuests(this.selectedDate, true); // force reload
        this.$message.success("Swap completed!");
        this.$emit("guestSaved");
        this.closeModal();
      } catch (err) {
        console.error("Swap error:", err);
        this.$message.error("Could not complete partial swap.");
      }
    },
    isSpotOccupied(id) {
      const currentStay = this.guest?.stayId;
      const stayOnSpot = this.store.bookingsToday?.[id];

      return (
        stayOnSpot && (!currentStay || stayOnSpot.id !== currentStay) // Ikke den samme
      );
    },
    getSpotLabel(id) {
      const stay = this.store.bookingsToday?.[id];
      if (stay && (!this.guest || stay.id !== this.guest.stayId)) {
        return `Spot ${id} – ${stay.car_number || "Occupied"}`;
      }
      return `Spot ${id}`;
    },
    hasValidationError(fieldName) {
      const field = this.$refs.guestForm?.fields?.find(
        (f) => f.prop === fieldName
      );
      const isInvalid = field?.validateState === "error";
      const isEmpty = !this.form[fieldName];
      return isInvalid || isEmpty;
    },
    onGuestSelected(item) {
      this.nameSelectedFromList = true;
      if (item?.guest) {
        fillGuestForm(this.form, item.guest, item.vip);
        this.isVip = item.vip;
      }
    },

    onCarSelected(item) {
      this.carSelectedFromList = true;
      if (item?.guest) {
        fillGuestForm(this.form, item.guest, item.guest.vip);
        this.isVip = item.guest.vip || false;
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
    querySearch(queryString, cb) {
      queryNationalitySuggestions(queryString, cb);
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

        // Ekstra sjekk for å hindre overskriving av annen gjest sin plass
        if (this.mode === "edit" && this.isSpotOccupied(this.form.spotId)) {
          this.$message.warning(
            `Spot ${this.form.spotId} is already occupied. Please propose a swap or select another spot.`
          );
          return;
        }

        const checkInDate = new Date(this.form.check_in);
        checkInDate.setHours(15, 0, 0, 0);

        const checkOutDate = new Date(this.form.check_out);
        checkOutDate.setHours(12, 0, 0, 0);

        const guestPayload = {
          name: this.form.name,
          car_number: this.form.car_number,
          nationality: this.form.nationality,
        };

        const stayPayload = {
          spot_Id: this.form.spotId,
          check_in: dayjs(checkInDate).format("YYYY-MM-DDTHH:mm:ss"),
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
            console.log("Innsjekk som sendes:", stayPayload.check_in);
            console.log("Utsjekk som sendes:", stayPayload.check_out);
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
          this.$emit("guestSaved");
          this.closeModal();
        } catch (err) {
          console.error("❌ Guest save failed:", err);
          const message =
            err?.message && err.message !== "Failed to fetch"
              ? err.message
              : "Could not communicate with the server.";
          this.$message.error(message);
        }
      });
    },
    async handleDelete() {
      this.$confirm(
        `Are you sure you want to delete ${this.guest.name} (${this.guest.car_number})?`,
        "Confirm Deletion",
        {
          confirmButtonText: "Yes, delete",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(async () => {
          try {
            await this.store.deleteGuest(this.guest.guestId, this.guest.stayId);
            this.$message.success("Guest deleted");
            this.$emit("guestSaved");
            this.closeModal();
          } catch (err) {
            console.error(err);
            this.$message.error("Deletion failed");
          }
        })
        .catch(() => {
          this.$message.info("Deletion cancelled.");
        });
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
  z-index: 700;
}
.modal-content {
  position: relative;
  background: white;
  padding: 10px;
  border-radius: 8px;
  max-width: 90%;
  max-height: none;
  width: 500px;
  overflow: hidden !important;
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

::v-deep(.el-form-item__label) {
  position: relative;
}
::v-deep(.el-form-item__label::before) {
  display: none !important;
}
.modal-content .el-form {
  width: 100%;
  max-width: 350px;
}
.form-indent {
  margin-left: 12px;
}
</style>
