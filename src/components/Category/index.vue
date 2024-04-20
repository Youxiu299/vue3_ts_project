<template>
  <el-card>
    <!-- <el-form :inline="true">
      <el-form-item label="Activity zone">
        <el-select placeholder="Activity zone">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="Activity zone">
        <el-select placeholder="Activity zone">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="Activity zone">
        <el-select placeholder="Activity zone">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
    </el-form> -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select v-model="categoryStore.c1Id" @change="handler">
          <el-option
            v-for="c1 in categoryStore.c1Arr"
            :label="c1.name"
            :value="c1.id"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="categoryStore.c2Id" @change="handler2">
          <el-option
            v-for="c2 in categoryStore.c2Arr"
            :label="c2.name"
            :value="c2.id"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="categoryStore.c3Id">
          <el-option
            v-for="c3 in categoryStore.c3Arr"
            :label="c3.name"
            :value="c3.id"
            :key="c3.id"
          ></el-option>
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
const getC1 = () => {
  categoryStore.getC1()
}
const handler = () => {
  categoryStore.c2Id = ''
  categoryStore.c3Arr = []
  categoryStore.c3Id = ''
  categoryStore.getC2()
}
const handler2 = () => {
  categoryStore.c3Id = ''
  categoryStore.getC3()
}
</script>

<style scoped>
.demo-form-inline .el-input {
  --el-input-width: 180px;
}

.demo-form-inline .el-select {
  --el-select-width: 180px;
}
</style>
