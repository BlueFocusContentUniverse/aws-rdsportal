<template>
  <el-menu
      default-active="1"
      class="sidebar"
      background-color="#2d3a4b"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
      :collapse="collapse"
  >
    <div class="logo">
      <img src="/logo-small.png" alt="logo" />
<!--      <span v-if="!collapse">Vite + Vue</span>-->
    </div>
    <el-menu-item index="/projects">
      项目列表
    </el-menu-item>
    <!-- 可以加更多菜单 -->
  </el-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const collapse = ref(false) // 可折叠，可根据需要
</script>

<style scoped>
.sidebar {
  height: 100vh;
  width: 200px;
}
.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}
.logo img {
  height: 40px;
  margin-right: 10px;
}
</style>
