<template>
  <div class="login-container">
    <el-card class="login-card" shadow="hover">
      <div class="title">系统登录</div>

      <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="top"
          @keyup.enter="handleLogin"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
              v-model="form.username"
              placeholder="请输入用户名"
              clearable
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button
              type="primary"
              class="login-button"
              :loading="loading"
              @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive} from 'vue'
import {ElMessage} from 'element-plus'
import {useRoute, useRouter} from 'vue-router'
import {setToken} from '../utils/auth'
import {login} from '../api/auth'


const router = useRouter()
const route = useRoute()

const formRef = ref()

const loading = ref(false)

const form = reactive({
  username: '',
  password: '',
})

const rules = {
  username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
  password: [{required: true, message: '请输入密码', trigger: 'blur'}],
}

const handleLogin = async () => {
  await formRef.value.validate()

  loading.value = true
  try {
    const res = await login(form.username, form.password)


    setToken(res.data.access_token)

    ElMessage.success('登录成功')

    // 登录成功跳转
    const redirect = '/projects'
    await router.replace(redirect)
  } catch (err: any) {
    ElMessage.error(
        err?.response?.data?.message || '登录失败'
    )
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1f2d3d, #2d3a4b);
}

.login-card {
  width: 360px;
  padding: 10px 20px;
}

.title {
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #2d3a4b;
}

.login-button {
  width: 100%;
}
</style>
