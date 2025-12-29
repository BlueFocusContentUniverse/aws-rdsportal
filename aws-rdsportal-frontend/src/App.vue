<template>
  <div class="layout">
    <!-- 左侧侧边栏 -->
    <Sidebar />

    <!-- 右侧主内容区 -->
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh; /* 占满整个页面高度 */
}

/* 右侧内容区自适应，允许滚动 */
.content {
  flex: 1;
  overflow-y: auto;
  background-color: #f5f7fa; /* 可以根据喜好调整 */
  padding: 20px;
}
</style>
