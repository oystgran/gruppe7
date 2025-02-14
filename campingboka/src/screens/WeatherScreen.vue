<template>
    <div class="weather-screen">
        <h1>Været</h1>
        <p>Campingboka</p>

        <div class="meteogram-container">
            <img src="https://www.yr.no/en/content/1-72837/meteogram.svg" alt="Yr.no Weather Forecast" class="meteogram" />
        </div>

        <div class="weather-table-container">
            <iframe 
                src="https://www.yr.no/nb/innhold/1-177457/table.html" 
                title="Yr Weather Table"
                class="weather-table"
                frameborder="0"
                loading="lazy">
            </iframe>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WeatherScreen',
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

.weather-table-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
}

.weather-table {
    width: 100%;
    max-width: 800px;
    height: 500px;
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