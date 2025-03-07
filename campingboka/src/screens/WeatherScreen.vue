<template>
    <div class="weather-screen">
        <h1>Været</h1>
        <p>Campingboka</p>

        <div class="button-container">
            <el-button @click="selectedWidget = 'card'" :class="{ active: selectedWidget === 'card' }">
                Vær-kort
            </el-button>
            <el-button @click="selectedWidget = 'meteogram'" :class="{ active: selectedWidget === 'meteogram' }">
                Meteogram
            </el-button>
            <el-button @click="selectedWidget = 'table'" :class="{ active: selectedWidget === 'table' }">
                Vær-tabell
            </el-button>
        </div>

        <div v-if="selectedWidget === 'card'" class="weather-card-container">
            <iframe 
                src="https://www.yr.no/en/content/1-177457/card.html" 
                title="Yr Weather Card"
                class="weather-card"
                frameborder="0"
                loading="eager"
                >
            </iframe>
        </div>

        <div v-if="selectedWidget === 'meteogram'" class="meteogram-container">
            <img src="https://www.yr.no/en/content/1-72837/meteogram.svg" alt="Yr.no Weather Forecast" class="meteogram" loading="eager"/>
            
        </div>

        <div v-if="selectedWidget === 'table'" class="weather-table-container">
            <iframe 
                src="https://www.yr.no/en/content/1-177457/table.html" 
                title="Yr Weather Table"
                class="weather-table"
                frameborder="0"
                loading="eager"
                >
            </iframe>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WeatherScreen',
    data() {
        return {
            selectedWidget: 'card'
        };
    }
};
</script>

<style scoped>
.weather-screen {
    text-align: center;
    margin-top: 50px;
}

.weather-screen h1 {
    font-size: 2.5em;
    color: #4CAF50;
}

.weather-screen p {
    font-size: 1.2em;
    color: #555;
}

.button-container {
    display: flex;
    justify-content: center;
    gap: 0px;
    margin: 20px 0;
}

button {
    font-size: 15px;
    border-color: #394856;
    background-color: #394856;
    color: white;
    cursor: pointer;

}

button:hover {
    background-color: #252f38;
    color: white;
}

button.active {
    background-color: white;
    color: #333;
}

.weather-card-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
}

.weather-card {
    width: 100%;
    max-width: 400px;
    height: 370px;
    border-radius: 10px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.weather-table-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
}

.weather-table {
    width: 100%;
    max-width: 800px;
    height: 510px;
    border-radius: 10px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.meteogram-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
}

.meteogram {
    max-width: 100%;
    height: auto;
    border-radius: 10px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}
</style>