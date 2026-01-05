<template>
  <el-menu
      default-active="/projects"
      class="sidebar"
      background-color="#2d3a4b"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
      :collapse="collapse"
  >
    <!-- Logo 保留原样 -->
    <div class="logo-container">
      <div class="logo">
        BlueFocus
      </div>
    </div>

    <!-- 菜单项 -->
    <el-menu-item index="/projects">
      项目列表
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const collapse = ref(false) // 可折叠状态
</script>

<style scoped>
.sidebar {
  height: 100vh;
  width: 200px;
  background-color: #2d3a4b;
}

/* Logo 部分保持原样 */
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  background-color: #2d3a4b;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: #ffd04b;
  letter-spacing: 1px;
  font-family: 'Segoe UI', Roboto, Arial, sans-serif;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  user-select: none;
  cursor: default;
  transition: all 0.2s ease-in-out;
}

.logo:hover {
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.4);
}

/* 选中菜单项文字高亮 + 位置相对 */
.sidebar :deep(.el-menu-item.is-active) {
  position: relative;
  color: #ffd04b; /* 文字高亮 */
}

/* 左侧箭头标记 */
.sidebar :deep(.el-menu-item.is-active)::before {
  content: "▶";              /* 你也可以换成 "›" 或 SVG */
  position: absolute;
  left: 0;                    /* 靠左边 */
  top: 50%;
  transform: translateY(-50%);
  color: #ffd04b;             /* 高亮颜色 */
  font-size: 16px;
  transition: all 0.2s;
}

/* 折叠状态下箭头隐藏 */
.sidebar[style*="width: 64px"] :deep(.el-menu-item.is-active)::before {
  display: none;
}
</style>
