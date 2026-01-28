<template>
  <el-menu
      default-active="/projects/list"
      class="sidebar"
      background-color="transparent"
      text-color="#a0aec0"
      active-text-color="#63b3ed"
      router
      :collapse="collapse"
  >
    <!-- Logo容器 (保持不变) -->
    <div class="logo-container">
      <div class="logo">
        <span class="logo-text">BlueFocus</span>
        <div class="logo-glow"></div>
      </div>
    </div>

    <!-- 示例：数据查询 (父菜单) -->
    <el-sub-menu index="1" class="sub-menu-wrapper">
      <template #title>
        <span class="sub-menu-title">数据查询</span>
      </template>
      <!-- 子菜单项 -->
      <el-menu-item index="/projects" class="menu-item">
        <span class="item-text">项目列表(生产数据库)</span>
        <div class="item-active-mark"></div>
      </el-menu-item>
      <el-menu-item index="/projectsDEV" class="menu-item">
        <span class="item-text">项目列表(开发数据库)</span>
        <div class="item-active-mark"></div>
      </el-menu-item>
    </el-sub-menu>

    <!-- 示例：系统管理 (另一个父菜单) -->
    <el-sub-menu index="2" class="sub-menu-wrapper">
      <template #title>
        <span class="sub-menu-title">系统管理</span>
      </template>
      <el-menu-item index="/system/users" class="menu-item">
        <span class="item-text">用户管理</span>
        <div class="item-active-mark"></div>
      </el-menu-item>
    </el-sub-menu>

    <!-- 未来可以在这里添加更多顶级菜单 -->
    <!-- <el-menu-item index="/dashboard" class="menu-item">
      <span class="item-text">数据概览</span>
      <div class="item-active-mark"></div>
    </el-menu-item> -->

  </el-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const collapse = ref(false) // 可折叠状态
</script>

<style scoped>
/* 侧边栏基础样式 (保持不变) */
.sidebar {
  height: 100vh;
  width: 220px;
  background: linear-gradient(180deg, #1a202c 0%, #2d3748 100%);
  backdrop-filter: blur(8px);
  border-right: 1px solid rgba(75, 85, 99, 0.3);
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 折叠状态调整 (保持不变) */
.sidebar:not(.el-menu--collapse) {
  width: 220px;
}
.sidebar.el-menu--collapse {
  width: 80px;
}

/* Logo容器 (保持不变) */
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  position: relative;
  padding: 0 20px;
  border-bottom: 1px solid rgba(75, 85, 99, 0.2);
}
.logo {
  position: relative;
  z-index: 2;
}
.logo-text {
  font-size: 26px;
  font-weight: 800;
  color: #63b3ed;
  letter-spacing: 2px;
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  text-shadow: 0 0 8px rgba(99, 179, 237, 0.5);
  user-select: none;
}
.logo-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 60%;
  background: radial-gradient(circle, rgba(99, 179, 237, 0.2) 0%, transparent 70%);
  z-index: 1;
}

/* --- 新增和修改的样式 --- */

/* 父菜单 (el-sub-menu) 样式 */
.sub-menu-wrapper {
  border-radius: 8px;
  margin: 8px 12px;
  overflow: hidden;
}

/* 父菜单标题样式 */
.sub-menu-title {
  font-size: 16px;
  font-weight: 500;
  color: #a0aec0;
  transition: color 0.2s ease;
}
/* 父菜单标题在hover或其子项激活时的高亮效果 */
.sidebar :deep(.el-sub-menu__title:hover .sub-menu-title),
.sidebar :deep(.el-sub-menu.is-active .sub-menu-title) {
  color: #63b3ed;
}

/* 子菜单容器样式 */
.sidebar :deep(.el-sub-menu .el-menu) {
  background-color: rgba(26, 32, 44, 0.5) !important;
}

/* 菜单项 (el-menu-item) 样式 */
.menu-item {
  position: relative;
  height: 50px; /* 子项高度稍小，显得更紧凑 */
  margin: 0 8px; /* 与父菜单边框保持距离 */
  border-radius: 6px;
  transition: all 0.2s ease;
  overflow: hidden;
}
.menu-item:hover {
  background-color: rgba(75, 85, 99, 0.2);
}

/* 菜单项文字 */
.item-text {
  font-size: 15px;
  font-weight: 400;
  transition: all 0.2s ease;
}

/* 选中状态标记 (科技感侧条) */
.item-active-mark {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background: linear-gradient(180deg, #63b3ed 0%, #3182ce 100%);
  box-shadow: 0 0 8px rgba(99, 179, 237, 0.6);
  opacity: 0;
  transition: opacity 0.2s ease;
}

/* 选中时显示标记 + 文字高亮 */
.sidebar :deep(.el-menu-item.is-active) .item-text {
  color: #63b3ed;
  text-shadow: 0 0 6px rgba(99, 179, 237, 0.4);
}
.sidebar :deep(.el-menu-item.is-active) .item-active-mark {
  opacity: 1;
}

/* 折叠状态下调整 */
.sidebar.el-menu--collapse .logo-text {
  font-size: 18px;
}
.sidebar.el-menu--collapse .item-text,
.sidebar.el-menu--collapse .sub-menu-title {
  display: none;
}
</style>