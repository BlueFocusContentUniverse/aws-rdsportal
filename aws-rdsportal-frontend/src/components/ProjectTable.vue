<template>
  <div class="project-table">
    <!-- 搜索栏 + 操作栏 -->
    <el-form :inline="true" class="search-form" @submit.prevent
             style="display: flex; flex-wrap: wrap; align-items: center; gap: 10px;">
      <!-- 左边搜索项 + 按钮 -->
      <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
        <el-form-item label="项目ID">
          <el-input v-model="filters.project_id" placeholder="请输入项目ID" clearable/>
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input v-model="filters.user_id" placeholder="请输入用户ID" clearable/>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
              v-model="filters.date_range"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="YYYY-MM-DDTHH:mm:ss"
              clearable
          />
        </el-form-item>
        <el-form-item>
          <el-dropdown style="margin-bottom: 0" :hide-on-click="false" trigger="click">
            <el-button type="primary">
              选择列
              <el-icon class="el-icon-search">
                <arrow-down/>
              </el-icon>
            </el-button>

            <!-- 使用 #dropdown 插槽 -->
            <template #dropdown>
              <el-dropdown-menu class="column-dropdown-menu" style="min-width: 180px; padding: 0;">
                <el-dropdown-item>
                  <div style="padding: 8px;">
                    <!-- 全选/全不选按钮 -->
                    <el-button type="text" size="small" @click="selectAllColumns">全选</el-button>
                    <el-button type="text" size="small" @click="deselectAllColumns">全不选</el-button>
                    <el-divider></el-divider>

                    <!-- 列复选框 -->
                    <el-checkbox-group v-model="selectedColumns" style="display: flex; flex-direction: column;">
                      <el-checkbox
                          v-for="col in allColumns"
                          :key="col.prop"
                          :label="col.prop"
                      >
                        {{ col.label }}
                      </el-checkbox>
                    </el-checkbox-group>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-form-item>

        <!-- 搜索 + 重置按钮 -->
        <el-form-item>
          <el-button type="primary" @click="fetchProjects">
            <i class="el-icon-search" style="margin-right: 4px;"></i>
            搜索
          </el-button>
          <el-button @click="resetFilters">重置</el-button>
        </el-form-item>
      </div>
    </el-form>


    <!-- 表格 -->
    <el-table
        :data="projects"
        v-loading="loading"
        :stripe="true"
        border
        max-height="600"
        :show-overflow-tooltip="true"
        style="min-width: 1200px; overflow-x: auto; margin-top: 16px;"
    >
      <el-table-column
          v-for="col in displayedColumns"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
      >
        <template v-if="col.tooltip" #default="{ row }">
          <el-tooltip :content="row[col.prop] || '无'" placement="top">
            <span class="ellipsis">{{ row[col.prop] || '无' }}</span>
          </el-tooltip>
        </template>
        <template v-else-if="col.format" #default="{ row }">
          <span>{{ col.format(row[col.prop] ?? '') }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
        v-if="total > pageSize"
        background
        layout="prev, pager, next"
        :current-page="page"
        :page-size="pageSize"
        :total="total"
        @current-change="handlePageChange"
        class="pagination"
    />
  </div>
</template>


<script setup lang="ts">
import {ref, computed, onMounted} from 'vue'
import {getProjectsPage} from '../api/project'

interface Filters {
  user_id: string | null
  project_id: string | null
  date_range: [string, string] | null
}

interface Column {
  label: string
  prop: string
  width?: string | number
  tooltip?: boolean
  format?: (val: any) => string
}

const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const projects = ref([])
const loading = ref(false)
const filters = ref<Filters>({
  user_id: null,
  project_id: null,
  date_range: null
})

// 定义所有列信息
const allColumns: Column[] = [
  {label: '项目ID', prop: 'project_id', width: 180},
  {label: '用户ID', prop: 'user_id', width: 220},
  {label: '标题', prop: 'title', width: 180, tooltip: true},
  {label: '视频URL', prop: 'video_url', width: 220, tooltip: true},
  {label: '核心创意', prop: 'key_concept', width: 250, tooltip: true},
  {label: '海报URL', prop: 'poster_url', width: 220, tooltip: true},
  {label: '分享码', prop: 'share_code', width: 180},
  {label: '用户输入', prop: 'user_prompt', width: 300, tooltip: true},
  {label: '封面URL', prop: 'cover_url', width: 220, tooltip: true},
  {label: '缩略图URL', prop: 'thumbnail_url', width: 220, tooltip: true},
  {label: 'BannerURL', prop: 'banner_url', width: 220, tooltip: true},
  {label: '分享海报URL', prop: 'share_poster_url', width: 220, tooltip: true},
  {label: '创建时间', prop: 'created_at', width: 180, format: (val) => val ? new Date(val).toLocaleString() : '无'},
  {label: '更新时间', prop: 'updated_at', width: 180, format: (val) => val ? new Date(val).toLocaleString() : '无'}
]

// 默认全选
const selectedColumns = ref(allColumns.map(col => col.prop))

// 根据选中列动态显示
const displayedColumns = computed(() =>
    allColumns.filter(col => selectedColumns.value.includes(col.prop))
)

// 列选择控制
const selectAllColumns = () => selectedColumns.value = allColumns.map(col => col.prop)
const deselectAllColumns = () => selectedColumns.value = []

// 分页 & 搜索
const resetFilters = () => {
  filters.value = {user_id: null, project_id: null, date_range: null}
  page.value = 1
  fetchProjects()
}

const handlePageChange = (newPage: number) => {
  page.value = newPage
  fetchProjects()
}

const fetchProjects = async () => {
  loading.value = true
  try {
    const res = await getProjectsPage(page.value, pageSize.value, filters.value)
    projects.value = res.data.items
    total.value = res.data.total
  } catch (err) {
    console.error('获取项目列表失败', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProjects()
})
</script>

<style scoped>
.project-table {
  padding: 20px;
}

.search-form {
  margin-bottom: 15px;
}

.pagination {
  margin-top: 15px;
  text-align: right;
}

/* 文字溢出省略 */
.ellipsis {
  display: inline-block;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.column-dropdown-menu {
  min-width: 180px;
}
</style>
