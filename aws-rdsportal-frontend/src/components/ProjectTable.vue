<template>
  <div class="project-table">
    <!-- 搜索栏（保持原样，可扩展） -->
    <el-form :inline="true" class="search-form" @submit.prevent>
    <!-- todo搜索功能尚不完善有部分错误 -->
      <el-form-item label="项目ID">
        <el-input v-model="filters.project_id" placeholder="请输入项目ID" clearable />
      </el-form-item>
      <el-form-item label="用户ID">
        <el-input v-model="filters.user_id" placeholder="请输入用户ID" clearable />
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
        <el-button type="primary" @click="fetchProjects">
          <i class="el-icon-search" style="margin-right: 4px;"></i>
          搜索
        </el-button>
        <el-button @click="resetFilters">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table
        :data="projects"
        v-loading="loading"
        :stripe="true"
        border
        max-height="600"
        :show-overflow-tooltip="true"
        style="min-width: 1200px; overflow-x: auto;"
    >
      <el-table-column prop="project_id" label="项目ID" width="180" />
      <el-table-column prop="user_id" label="用户ID" width="220" />
      <el-table-column prop="title" label="标题" width="180">
        <template #default="{ row }">
          <el-tooltip :content="row.title || '无'" placement="top">
            <span class="ellipsis">{{ row.title || '无' }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="video_url" label="视频URL" width="220">
        <template #default="{ row }">
          <el-tooltip :content="row.video_url || '无'" placement="top">
            <span class="ellipsis">{{ row.video_url || '无' }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="key_concept" label="核心创意" width="250">
        <template #default="{ row }">
          <el-tooltip :content="row.key_concept || '无'" placement="top">
            <span class="ellipsis">{{ row.key_concept || '无' }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="poster_url" label="海报URL" width="220">
        <template #default="{ row }">
          <el-tooltip :content="row.poster_url || '无'" placement="top">
            <span class="ellipsis">{{ row.poster_url || '无' }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="share_code" label="分享码" width="180" />
      <el-table-column prop="user_prompt" label="用户输入" width="300">
        <template #default="{ row }">
          <el-tooltip :content="row.user_prompt || '无'" placement="top">
            <span class="ellipsis">{{ row.user_prompt || '无' }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="cover_url" label="封面URL" width="220">
        <template #default="{ row }">
          <el-tooltip :content="row.cover_url || '无'" placement="top">
            <span class="ellipsis">{{ row.cover_url || '无' }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="thumbnail_url" label="缩略图URL" width="220">
        <template #default="{ row }">
          <el-tooltip :content="row.thumbnail_url || '无'" placement="top">
            <span class="ellipsis">{{ row.thumbnail_url || '无' }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="banner_url" label="BannerURL" width="220">
        <template #default="{ row }">
          <el-tooltip :content="row.banner_url || '无'" placement="top">
            <span class="ellipsis">{{ row.banner_url || '无' }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="share_poster_url" label="分享海报URL" width="220">
        <template #default="{ row }">
          <el-tooltip :content="row.share_poster_url || '无'" placement="top">
            <span class="ellipsis">{{ row.share_poster_url || '无' }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" width="180">
        <template #default="{ row }">
          <span>{{ row.created_at ? new Date(row.created_at).toLocaleString() : '无' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updated_at" label="更新时间" width="180">
        <template #default="{ row }">
          <span>{{ row.updated_at ? new Date(row.updated_at).toLocaleString() : '无' }}</span>
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
import { ref, onMounted } from 'vue'
import { getProjectsPage } from '../api/project'

interface Filters {
  user_id: string | null
  project_id: string | null
  date_range: [string, string] | null
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

const resetFilters = () => {
  filters.value = { user_id: null, project_id: null, date_range: null }
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
</style>
