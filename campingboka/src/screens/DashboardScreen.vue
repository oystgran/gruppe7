<template>
    <div class="dashboard-screen">
        <h1>Dashboard</h1>
        <p>Campingboka</p>
        <el-button>I am ElButton</el-button>
        <AddGuestModal />
    </div>
</template>

<script>
import AddGuestModal from '@/components/AddGuestModal.vue';
import { ElButton } from 'element-plus';

export default {
    name: 'ControlScreen',
    components: { ElButton, AddGuestModal },
};

</script>

<style scoped>
.dashboard-screen {
    text-align: center;
    margin-top: 50px;
}

.dashboard-screen h1 {
    font-size: 2.5em;
    color: #4CAF50;
}

.dashboard-screen p {
    font-size: 1.2em;
    color: #555;
}
</style>