<template>
  <el-button
    size="small"
    icon="Refresh"
    @click="updateRefsh"
    circle
  ></el-button>
  <el-button
    size="small"
    icon="FullScreen"
    circle
    @click="fullScreen"
  ></el-button>
  <el-button size="small" icon="Setting" circle></el-button>
  <img
    :src="userStore.avatar"
    style="width: 24px; height: 24px; margin: 0 10px; border-radius: 50%"
    alt=""
  />
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
// 获取layout小仓库
import useLayOutSettingStore from '@/store/modules/setting'
//获取用户相关的小仓库
import useUserStore from '@/store/modules/user'
let userStore = useUserStore()
let layoutSettingStore = useLayOutSettingStore()
let $router = useRouter()
let $route = useRoute()
//点击刷新按钮方法
const updateRefsh = () => {
  layoutSettingStore.refsh = !layoutSettingStore.refsh
}
//点击全屏模式按钮
const fullScreen = () => {
  //DOM对象属性：用来判断当前是否全屏模式[全屏:true|非全屏:false]
  let full = document.fullscreenElement
  //切换为全屏模式
  if (!full) {
    //文档根节点方法requestFullscreen，实现全屏模式
    document.documentElement.requestFullscreen()
  } else {
    //退出全屏模式
    document.exitFullscreen()
  }
}
//退出登录
const logout = async () => {
  /**
   * 服务器发请求
   * 仓库中关于用户相关数据清空
   * 跳转到登录页面
   */
  await userStore.userLogout()
  //跳转登录页面$router.push({ path: '/login' })
  //跳转登陆页面登陆成功后回到退出前的页面
  $router.push({ path: '/login', query: { redirect: $route.path } })
}
</script>
<script lang="ts">
export default {
  name: 'Setting',
}
</script>

<style scoped></style>
