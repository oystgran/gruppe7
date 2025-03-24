<template>
    <div class="map-screen">
        <MapComponent @rectangle-clicked="handleRectangleClicked"/>  

        <AddGuestModal
        :visible="showAddGuestModal"
        :initialPlass="selectedPlass"
        @close="showAddGuestModal = false"/>


        <el-button type="primary" @click="openModal">Vis plakat</el-button>

        <div v-if="isModalOpen" class="modal">
            <div class="modal-content">
                <span class="close" @click="closeModal">&times;</span>
                <img :src="posterMap" alt="Kart" class="modal-image" />
            </div>
        </div>
    </div>
</template>

<script>
import posterMap from '@/assets/posterMap.png';
import MapComponent from '@/components/MapComponent.vue';
import AddGuestModal from '@/components/AddGuestModal.vue';


export default {
    name: 'MapScreen',
    components: { MapComponent, AddGuestModal },
    data() {
        return {
            posterMap: posterMap,
            isModalOpen: false,
            showAddGuestModal: false,
            selectedPlass: null,
        };
    },
    methods: {
        handleRectangleClicked(number) {
            this.selectedPlass = number;
            this.showAddGuestModal = true;
        },
        openModal() {
            this.isModalOpen = true;
        },
        closeModal() {
            this.isModalOpen = false;
        }
    }
};
</script>

<style scoped>
.map-screen {
    text-align: center;
}

.map-screen h1 {
    font-size: 2.5em;
    color: #4CAF50;
}

.map-screen p {
    font-size: 1.2em;
    color: #555;
}


button {
    font-size: 15px;
    cursor: pointer;
}

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
    overflow: auto;
    text-align: center;
}

.modal-image {
    width: 100%;
    max-width: 700px;
    border-radius: 10px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.close {
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 34px;
    font-weight: bold;
    cursor: pointer;
    padding-top: 8px;
    padding-bottom: 8px;
    padding-left: 10px;
    padding-right: 10px;
    color: black;
}

.close:hover {
    color: red;
}
</style>