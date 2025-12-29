<template>
  <div class="layout">
    <div class="content">
      <ProjectTable />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProjectTable from '../components/ProjectTable.vue'
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
}
.content {
  flex: 1;
  overflow-y: auto;
}
</style>
