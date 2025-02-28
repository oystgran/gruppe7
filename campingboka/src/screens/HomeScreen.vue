<template>
    <div class="home-screen">
        <h1>Home</h1>
        <p>Campingboka</p>
        <!-- <AgGridTable></AgGridTable> -->
        <ArchiveTable></ArchiveTable>
    </div>
</template>

<script>
/* import AgGridTable from '@/components/AgGridTable.vue'; */
import ArchiveTable from '@/components/ArchiveTable.vue';

export default {
    name: 'HomeScreen',
    components: {
        /* AgGridTable */
        ArchiveTable, // Add it here
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