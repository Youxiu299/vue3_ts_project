<template>
  <div>
    <!-- 三级分类全局组件 -->
    <Category :scene="scene" />
    <el-card style="margin: 10px 0">
      <div v-show='scene == 0'>
        <el-button type="primary" size="default" icon="Plus" @click="addAttr"
          :disabled="categoryStore.c3Id ? false : true">
          添加属性
        </el-button>
        <el-table border style="margin: 10px 0" :data="attrArr">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="属性名称" width="150px" prop="attrName"></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row }">
              <el-tag style="margin: 5px;" v-for="item in row.attrValueList" :key="item.id">{{ item.valueName
                }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px">
            <template #="{ row }">
              <el-button type="primary" size="small" icon="Edit" @click="updateAttr(row)"></el-button>
              <el-popconfirm :title="`你确定删除${row.attrName}?`" width="200px" @confirm="deleteAttr(row.id)">
                <template #reference>
                  <el-button type="primary" size="small" icon="Delete"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性与修改属性结构 -->
      <div v-show='scene == 1'>
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input placeholder="请输入属性名称" v-model="attrParams.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button :disabled="attrParams.attrName ? false : true" type="primary" size="default" icon="Plus"
          @click="addAttrValue">添加属性</el-button>
        <el-button size="default" @click="cancel">取消</el-button>
        <el-table border style="margin: 10px 0;" :data="attrParams.attrValueList">
          <el-table-column type="index" align="center" width="80px" label="序号"></el-table-column>
          <el-table-column label="属性名称">
            <!-- row 属性值对象 -->
            <template #='{ row, $index }'>
              <el-input :ref="(vc: any) => inputArr[$index] = vc" size="small" v-if="row.flag"
                @blur="toLook(row, $index)" placeholder="请输入属性值名称" v-model="row.valueName"></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #="{ row, index }">
              <el-button type="primary" size="small" icon="Delete"
                @click="attrParams.attrValueList.splice(index, 1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" size="default" @click="save"
          :disabled="attrParams.attrValueList.length > 0 ? false : true">保存</el-button>
        <el-button size="default" @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, reactive, nextTick, onBeforeUnmount } from 'vue'
//引入属性接口方法
import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from '@/api/product/attr'
import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type'
//分类仓库
import useCategoryStore from '@/store/modules/category'
import { ElMessage } from 'element-plus'
let categoryStore = useCategoryStore()
//存储已有属性与属性值
let attrArr = ref<Attr[]>([])
//定义card组件内容切换变量
let scene = ref<number>(0)//0=>显示属性与属性值结构 1=>显示添加与修改结构
//定义input数组
let inputArr = ref<any>([])
//收集新增属性的数据
let attrParams = reactive<Attr>({
  attrName: "",//新增属性名
  attrValueList: [],//新增属性值数组
  categoryId: '',//三级分类id
  categoryLevel: 3,//三级分类
})
//添加属性按钮
const addAttr = () => {
  //点击时清空添加属性的数据
  Object.assign(attrParams,
    {
      attrName: "",//新增属性名
      attrValueList: [],//新增属性值数组
      categoryId: categoryStore.c3Id,//三级分类id //点击按钮时收集三级分类id
      categoryLevel: 3,//三级分类
    })
  scene.value = 1
}
//修改属性按钮
const updateAttr = (row: Attr) => {
  scene.value = 1
  //将已有的属性对象赋值给attrParams对像即可
  //es6->Object.assign进行对象合并
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}
//删除属性按钮回调
const deleteAttr = async (attrId: number) => {
  let result = await reqRemoveAttr(attrId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除属性成功'
    })
    //获取已有的属性
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: '删除属性失败'
    })
  }
}
//取消按钮
const cancel = () => {
  scene.value = 0
}
//获取属性和属性值方法
const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore
  let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  if (result.code == 200) {
    attrArr.value = result.data
  }
}
//监听仓库三级分类ID变化
watch(() => categoryStore.c3Id, () => {
  //清空上一次查询的属性与属性值
  attrArr.value = []
  //没有三级分类id时不能发请求
  if (!categoryStore.c3Id) return
  //获取属性与属性值
  getAttr()
})
//添加属性值按钮回调
const addAttrValue = () => {
  attrParams.attrValueList.push({
    valueName: '',
    flag: true
  })
  //获取最后一个elinput组件聚焦
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}
//保存属性按钮回调
const save = async () => {
  let result: any = await reqAddOrUpdateAttr(attrParams)
  if (result.code == 200) {
    scene.value = 0
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改属性成功' : '新增属性成功'
    })
    //重新获取已有属性与属性值
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改属性失败' : '新增属性失败'
    })
  }
}
//控制编辑模式与查看模式的切换
const toLook = (row: AttrValue, $index: number) => {
  //非法情况判断1
  if (row.valueName.trim() == '') {
    //删除属性值为空的元素
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能为空'
    })
    return
  }
  //非法情况判断2
  let repeat = attrParams.attrValueList.find((item) => {
    //当前失去焦点属性值对象从当前数组中扣除判断
    if (item != row) {
      return item.valueName === row.valueName
    }
  })
  console.log("repeat", repeat);
  if (repeat) {
    //将重复属性值删除
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能重复'
    })
    return
  }
  row.flag = false
}
//修改属性
const toEdit = (row: AttrValue, $index: number) => {
  row.flag = true
  //nextTick 响应式数据发生变化，获取更新的DOM(组件实例)
  nextTick(() => {
    inputArr.value[$index].focus();
  })
}
//路由组件销毁时，把仓库分类相关数据清空
onBeforeUnmount(() => {
  //清空仓库数据
  categoryStore.$reset()
})

</script>

<style scoped></style>
