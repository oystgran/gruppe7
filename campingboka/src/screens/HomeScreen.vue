<template>
    <div class="home-screen">
        <h1>Home</h1>
        <p>Campingboka</p>
        <AgGridTable></AgGridTable>
    </div>
</template>

<script>
import AgGridTable from '@/components/AgGridTable.vue';

export default {
    name: 'HomeScreen',
    components: {
        AgGridTable, // Add it here
    },
};
</script>

<style scoped>
.home-screen {
    text-align: center;
    margin-top: 50px;
}

.home-screen h1 {
    font-size: 2.5em;
    color: #4CAF50;
}

.home-screen p {
    font-size: 1.2em;
    color: #555;
}
</style>