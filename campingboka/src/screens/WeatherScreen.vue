<template>
    <div class="weather-screen">
        <h1>Været</h1>
        <p>Campingboka</p>
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
</style>