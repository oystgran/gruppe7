<!--
  DateNavigator.vue
  --------------------------------------------------
  Component for selecting and navigating between dates:
    • Displays the selected date and weekday in a readable format.
    • Allows users to pick a date using a calendar input.
    • Includes previous/next day buttons for quick navigation.
    • Emits updates to parent component via v-model (modelValue).
    • Adapts layout responsively: mobile view shows only calendar icon input.
-->
<template>
  <div class="date-navigator">
    <label class="calendar-button" aria-label="Select date">
      <input
        id="date-input"
        type="date"
        :value="dateString"
        @change="onDateChange"
        class="mobile-date-input"
      />

      <svg
        class="calendar-icon"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 11H9V13H7V11ZM11 11H13V13H11V11ZM15 11H17V13H15V11ZM19 4H18V2H16V4H8V2H6V4H5C3.9 
             4 3 4.9 3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 
             19 4ZM19 20H5V9H19V20Z"
          fill="currentColor"
        />
      </svg>
    </label>

    <button @click="goBack" class="nav-button">&#9204;</button>

    <div class="date-display">
      <span class="weekday">{{ weekdayString }}</span>
      <div class="date-input-container">
        <input
          type="date"
          :value="dateString"
          @change="onDateChange"
          class="date-input"
        />
      </div>
    </div>

    <button @click="goForward" class="nav-button">&#9205;</button>
  </div>
</template>

<script>
import { ref, defineComponent, computed } from "vue";

export default defineComponent({
  name: "DateNavigator",
  props: {
    modelValue: {
      type: Date,
      default: () => new Date(),
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const selectedDate = ref(new Date(props.modelValue));
    const dateString = ref(formatDate(selectedDate.value));

    const weekdayString = computed(() =>
      selectedDate.value.toLocaleDateString("en-US", { weekday: "long" })
    );

    function formatDate(d) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    }

    function changeDateBy(offset) {
      const d = new Date(selectedDate.value);
      d.setDate(d.getDate() + offset);
      selectedDate.value = d;
      dateString.value = formatDate(d);
      emit("update:modelValue", new Date(d));
    }

    function goBack() {
      changeDateBy(-1);
    }
    function goForward() {
      changeDateBy(1);
    }

    function onDateChange(e) {
      const d = new Date(e.target.value);
      selectedDate.value = d;
      dateString.value = e.target.value;
      emit("update:modelValue", d);
    }

    return {
      weekdayString,
      dateString,
      goBack,
      goForward,
      onDateChange,
    };
  },
});
</script>

<style scoped>
.date-navigator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 15px 0;
  position: relative;
}

.calendar-button {
  display: inline-block;
  position: relative;
  width: 1.6rem;
  height: 1.6rem;
  cursor: pointer;
  color: #ffffff;
  padding: 0.2rem;
}

.mobile-date-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  margin: 0;
  padding: 0;
  cursor: pointer;
  border: none;
  background: none;
}

.calendar-icon {
  width: 1.6rem;
  height: 1.6rem;
  display: block;
  fill: currentColor;
}

.nav-button {
  width: 30px;
  height: 30px;
  font-size: 1.6rem;
  cursor: pointer;
  background: none;
  border: none;
  color: #ffffff;
}

.date-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ffffff;
}
.weekday {
  font-size: 1.6rem;
  font-weight: bold;
  min-width: 10ch;
}
.date-input-container .date-input {
  border: none;
  background: transparent;
  font-family: inherit;
  text-align: center;
  font-size: 1rem;
  width: 8rem;
  cursor: pointer;
  color: #ffffff;
}
.date-input::-webkit-calendar-picker-indicator {
  filter: invert(1);
}
.date-input::-webkit-calendar-picker-indicator:hover {
  cursor: pointer;
}

/* MOBILE  */
@media (max-width: 600px) {
  .date-navigator > .nav-button,
  .date-navigator > .date-display {
    display: none !important;
  }
  .date-navigator {
    justify-content: center;
  }
}

/* DESKTOP  */
@media (min-width: 601px) {
  .calendar-button {
    display: none !important;
  }
}
</style>
