<template>
    <div class="date-navigator">
      <button @click="goBack" class="nav-button">&#9204;</button>
  
      <div class="date-display">
        <span class="weekday">{{ weekdayString }}</span>
        <div class="date-input-container">
          <input
            id="date-input"
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
  import { ref, defineComponent, computed } from 'vue';
  
  export default defineComponent({
    name: 'DateNavigator',
    props: {
      modelValue: {
        type: Date,
        default: () => new Date(),
      },
    },
    emits: ['update:modelValue'],
  
    setup(props, { emit }) {
      const selectedDate = ref(new Date(props.modelValue));
  
      const dateString = ref(formatDate(selectedDate.value));
  
      const weekdayString = computed(() => {
        return selectedDate.value.toLocaleDateString('en-US', { weekday: 'long' });
      });
  
      function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
  
      function goBack() {
        const oldDate = selectedDate.value;
        const newDate = new Date(oldDate);
        newDate.setDate(newDate.getDate() - 1);
  
        selectedDate.value = newDate;           
        dateString.value = formatDate(newDate); 
        emit('update:modelValue', new Date(newDate));
      }
  
      function goForward() {
        const oldDate = selectedDate.value;
        const newDate = new Date(oldDate);
        newDate.setDate(newDate.getDate() + 1);
  
        selectedDate.value = newDate;
        dateString.value = formatDate(newDate);
        emit('update:modelValue', new Date(newDate));
      }
  
      function onDateChange(event) {
        const newDate = new Date(event.target.value);
        selectedDate.value = newDate;
        dateString.value = event.target.value;
        emit('update:modelValue', newDate);
      }
  
      function openDatePicker() {
        const inputEl = document.getElementById('date-input');
        if (inputEl) {
          if (typeof inputEl.showPicker === 'function') {
            inputEl.showPicker();
          } else {
            inputEl.focus();
          }
        }
      }
  
      return {
        selectedDate,
        dateString,
        weekdayString,
        goBack,
        goForward,
        onDateChange,
        openDatePicker,
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
  }
  
  .nav-button {
    width: 30px;
    height: 30px;
    font-size: 1.6rem;
    cursor: pointer;
    background-color: none;
    border: none;
    color: #394856;
    background: none;
  }
  
  /* weekday + date */
  .date-display {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 3px;
    color: #394856;
    margin-right: 10px;

  }
  
  .weekday {
    font-size: 1.6rem;
    font-weight: bold;
    color: #394856;
    min-width: 10ch;

  }
  
  /* date + icon */
  .date-input-container {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0rem;
    color: #394856;

  }
  
  .date-input {
    border: none;
    background: transparent;
    font-family: inherit;
    text-align: center;
    font-size: 1rem;
    width: 8rem; 
    cursor: pointer;
    color: black;
  }
  
  .date-input::-webkit-calendar-picker-indicator:hover {
    cursor: pointer;
  }
  
  /* Simple calendar icon */
  .calendar-icon {
    cursor: pointer;
    font-size: 1.2rem;
    color: #394856;
  }
  </style>