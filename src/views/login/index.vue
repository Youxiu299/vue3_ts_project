<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24" class="login_form">
        <el-form :model="loginForm" :rules="rules" ref="loginForms">
          <h1>Hello</h1>
          <h2>欢迎来到甄选</h2>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :prefix-icon="Lock"
              type="password"
              show-password
              v-model="loginForm.password"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="login_btn"
              type="primary"
              size="default"
              @click="login"
              :loading="loading"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
//引入用户相关的小仓库
import useUserStore from '@/store/modules/user'
//引入获取当前时间的函数
import { getTime } from '@/utils/time'
let useStore = useUserStore()
//获取路由
let $router = useRouter()
let $route = useRoute()
let loginForm = reactive({ username: 'admin', password: '111111' })
let loading = ref(false)
//获取el-form组件
let loginForms = ref()
/**
 * 点击登录按钮 通知仓库发登录请求 请求成功->首页 失败->弹出失败信息
 */
const login = async () => {
  //全部表单校验通过再发请求
  await loginForms.value.validate()
  loading.value = true
  try {
    //保证登陆成功
    await useStore.userLogin(loginForm)
    //编程式导航跳转到首页
    //判断登录的时候路由路径当中有没有query参数，有就跳转query参数地址，没有就回首页
    let redirect: any = $route.query.redirect
    $router.push({ path: redirect || '/' })
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `HI,${getTime()}好`,
    })
    loading.value = false
  } catch (error) {
    loading.value = false
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  }
}
//自定义校验用户名规则函数
const validateUserName = (_rule: any, value: any, callback: any) => {
  /**
   * rule:校验规则对象
   * value:表单元素文本内容
   * callback:函数->符合条件callback通过|不符合条件callback方法，注入错误提示信息
   */
  if (value.length >= 5 && value.length <= 10) {
    callback()
  } else {
    callback(new Error('帐号长度为5~10位'))
  }
}
//自定义校验密码规则函数
const validatePassword = (_rule: any, value: any, callback: any) => {
  if (value.length >= 6 && value.length <= 15) {
    callback()
  } else {
    callback(new Error('密码长度为6~15位'))
  }
}

const rules = {
  /**
   * required:是否为必填项
   * min:文本最少长度
   * max:文本最大长度
   * message:错误提示信息
   * tiigger:触发校验表单的时机，change->文本吧发生变化时触发，blur：失去焦点时触发校验规则
   */
  username: [
    // {
    //   required: true,
    //   min: 5,
    //   max: 10,
    //   message: '帐号长度为5~10位',
    //   trigger: 'change',
    // },
    { trigger: 'change', validator: validateUserName },
  ],
  password: [{ trigger: 'change', validator: validatePassword }],
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
  .login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;
    h1 {
      color: white;
      font-size: 40px;
    }
    h2 {
      color: white;
      font-size: 20px;
      margin: 20px 0;
    }
    .login_btn {
      width: 100%;
    }
  }
}
</style>
