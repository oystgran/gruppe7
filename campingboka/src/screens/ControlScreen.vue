<template>
    <div class="control-screen">
        <h1>Kontroll</h1>
        <p>Campingboka</p>
        <el-button>I am ElButton</el-button>
    </div>
</template>

<script>
import { ElButton } from 'element-plus'

export default {
    name: 'ControlScreen',
    components: { ElButton },
};

</script>

<style scoped>
.control-screen {
    text-align: center;
    margin-top: 50px;
}

.control-screen h1 {
    font-size: 2.5em;
    color: #4CAF50;
}

.control-screen p {
    font-size: 1.2em;
    color: #555;
}
</style>