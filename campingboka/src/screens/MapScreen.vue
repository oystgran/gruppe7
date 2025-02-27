<template>
    <div class="map-screen">
        <h1>Kart</h1>
        <p>Campingboka</p>
        
        <button @click="openModal">Vis plakat</button>

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

export default {
    name: 'MapScreen',
    data() {
        return {
            posterMap: posterMap, 
            isModalOpen: false
        };
    },
    methods: {
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
    margin-top: 50px;
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
    padding: 8px 12px;
    font-size: 13px;
    border: none;
    border-radius: 7px;
    background-color: #394856;
    color: white;
    cursor: pointer;
    font-weight: bold;
}

button:hover {
    background-color: #252f38;
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
    z-index: 1;
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
    max-width: 600px;
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