<template>
    <div class="book-screen">
        <h1>Book</h1>
        <p>Campingboka</p>
        <!-- <AgGridTable></AgGridTable> -->
        <ArchiveTable></ArchiveTable>
    </div>
</template>

<script>
/* import AgGridTable from '@/components/AgGridTable.vue'; */
import ArchiveTable from '@/components/ArchiveTable.vue';

export default {
    name: 'BookScreen',
    components: {
        /* AgGridTable */
        ArchiveTable, // Add it here
    },
};
</script>

<style scoped>
.book-screen {
    text-align: center;
    margin-top: 50px;
}

.book-screen h1 {
    font-size: 2.5em;
    color: #4CAF50;
}

.book-screen p {
    font-size: 1.2em;
    color: #555;
}
</style>