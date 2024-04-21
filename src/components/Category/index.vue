<template>
  <el-card>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select v-model="categoryStore.c1Id" @change="handler" :disabled="scene == 0 ? false : true">
          <el-option v-for="c1 in categoryStore.c1Arr" :label="c1.name" :value="c1.id" :key="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="categoryStore.c2Id" @change="handler2" :disabled="scene == 0 ? false : true">
          <el-option v-for="c2 in categoryStore.c2Arr" :label="c2.name" :value="c2.id" :key="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="categoryStore.c3Id" :disabled="scene == 0 ? false : true">
          <el-option v-for="c3 in categoryStore.c3Arr" :label="c3.name" :value="c3.id" :key="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
//引入分类仓库
import useCategoryStore from '@/store/modules/category'
let categoryStore = useCategoryStore()
//组件挂载完毕
onMounted(() => {
  //获取一级分类数据
  getC1()
})
//获取仓库以及分类
const getC1 = () => {
  categoryStore.getC1()
}
//一级分类下拉菜单change事件，选中时触发，保证已选一级分类已有id
const handler = () => {
  categoryStore.c2Id = ''
  categoryStore.c3Arr = []
  categoryStore.c3Id = ''
  categoryStore.getC2()
}
//二级分类下拉菜单change事件，选中时触发，保证已选二级分类已有id
const handler2 = () => {
  categoryStore.c3Id = ''
  categoryStore.getC3()
}
//父组件传递过来的scene 保证添加属性时禁用选择分类select
defineProps(["scene"])
</script>

<style scoped>
.demo-form-inline .el-input {
  --el-input-width: 180px;
}

.demo-form-inline .el-select {
  --el-select-width: 180px;
}
</style>
