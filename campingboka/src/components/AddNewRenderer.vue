<template>
    <div class="add-new-container">
      <!-- Display the plus button if the cell is empty, otherwise show the existing value -->
      <span v-if="!cellValue" class="add-new-btn" @click="openPopup">➕</span>
      <span v-else>{{ cellValue }}</span>
    </div>
  </template>
  
  <script>
  export default {
    name: "AddNewRenderer",
    props: ["params"], // 'params' comes from AG Grid
    data() {
      return {
        cellValue: this.params?.value || "", // Use the value from the cell
      };
    },
    computed: {
      isFirstRow() {
        return this.params?.node?.rowIndex === 0; // Only the first row
      }
    },
    watch: {
      params: {
        immediate: true,
        handler(newParams) {
          if (newParams) {
            this.cellValue = newParams.value || "";
          }
        },
      },
    },
    created() {
      console.log("Cell Renderer Params:", this.params); // Debugging
    },
    methods: {
      openPopup() {
        // Add logic to open a popup when the plus button is clicked
        console.log("Plus button clicked");
      }
    }
  };
  </script>
  
  <style scoped>
  .add-new-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
  
  .add-new-btn {
    cursor: pointer;
    font-size: 1.2rem;
    color: green;
  }
  </style>