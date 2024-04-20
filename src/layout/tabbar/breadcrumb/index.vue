<template>
  <el-icon style="margin-right: 10px" @click="changeIcon">
    <component :is="LayOutSettingStore.fold ? 'Fold' : 'Expand'"></component>
  </el-icon>
  <!-- 左侧面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <!-- 动态展示路由名字与标题 -->
    <el-breadcrumb-item
      v-for="(item, index) in $router.matched"
      :key="index"
      v-show="item.meta.title"
      :to="item.path"
    >
      <!-- 图标 -->
      <el-icon style="vertical-align: middle">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <!-- 展示匹配路由的标题 -->
      <span style="margin: 0 5px">{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
// import { ref } from 'vue'
//引入路由对象
import { useRoute } from 'vue-router'
//获取layout配置相关的仓库
import useLayOutSettingStore from '@/store/modules/setting'
let $router = useRoute()
//定义响应式数据控制图标切换
let LayOutSettingStore = useLayOutSettingStore() //控制菜单折叠Fold/展开Expand的变量
//点击图标切换方法
const changeIcon = () => {
  LayOutSettingStore.fold = !LayOutSettingStore.fold
}
</script>
<script lang="ts">
export default {
  name: 'Breadcrumb',
}
</script>

<style scoped></style>
