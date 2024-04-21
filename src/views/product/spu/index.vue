<template>
  <div>
    <!-- 三级分类 -->
    <Category :scene="scene"></Category>

    <el-card style="margin: 10px 0;">
      <div v-show="scene == 0">
        <el-button type="primary" size="default" icon="Plus" :disabled="categoryStore.c3Id ? false : true"
          @click="addSpu">添加SPU</el-button>
        <el-table style="margin: 10px 0;" border :data="records">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column label="SPU描述" prop="description" show-overflow-tooltip></el-table-column>
          <el-table-column label="SPU操作">
            <template #="{ row }">
              <el-button type="primary" size="small" icon="Plus" title="添加SKU" @click="addSku(row)"></el-button>
              <el-button type="warning" size="small" icon="Edit" @click="updateSpu(row)" title="修改SPU"></el-button>
              <el-button type="info" size="small" icon="Warning" @click="findSku(row)" title="查看SKU列表"></el-button>
              <el-popconfirm :title="`你确定删除${row.spuName}?`" width="200px" @confirm="deleteSpu(row)">
                <template #reference>
                  <el-button type="danger" size="small" icon="Delete" title="删除SPU"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
          :background="true" layout=" prev, pager, next, jumper,->, sizes,total" :total="total"
          @current-change="getHasSpu" @size-change="changeSize" />
      </div>
      <!-- 添加修改spu子组件 -->
      <SpuForm ref="spu" v-show="scene == 1" @changeScene="changeScene"></SpuForm>
      <!-- 添加sku子组件 -->
      <SkuForm ref="sku" v-show="scene == 2" @changeScene="changeScene"></SkuForm>
      <!-- dialog对话框:展示已有的SKU数据 -->
      <el-dialog v-model="show" title="SKU列表">
        <el-table border :data="skuArr">
          <el-table-column label="SKU名字" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template #="{ row, $index }">
              <img :src="row.skuDefaultImg" style="width: 100px;height: 100px;">
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>


  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from "vue";
//引入spu接口方法
import { reqHasSpu, reqSkuList, reqRemoveSpu } from '@/api/product/spu'
import type { HasSpuResponseData, Records, SpuData, SkuInfoData, SkuData } from '@/api/product/spu/type'
//分类仓库
import useCategoryStore from '@/store/modules/category'
import { ElMessage } from 'element-plus'
import SpuForm from './spuForm.vue'
import SkuForm from './skuForm.vue'
let categoryStore = useCategoryStore()
//场景数据
let scene = ref<number>(0)//0显示已有spu 1添加或修改spu 2添加sku
//分页器默认页面
let pageNo = ref<number>(1)
//每页展示多少条数据
let pageSize = ref<number>(3)
//改变每页条数回调
const changeSize = () => {
  getHasSpu()
}
//总数
let total = ref<number>(0)
//已有spu数组
let records = ref<Records>([])
//获取子组件实例SpuForm
let spu = ref<any>()
//获取子组件实例SkuFrom
let sku = ref<any>()
//存储全部的SKU数据
let skuArr = ref<SkuData[]>([]);
let show = ref<boolean>(false);
//监听三级分类ID变化
watch(() => categoryStore.c3Id, () => {
  //必须有三级分类ID
  if (!categoryStore.c3Id) return
  getHasSpu()
})
//获取某一三级分类下全部spu
const getHasSpu = async (pager = 1) => {
  //修改当前页
  pageNo.value = pager
  let result: HasSpuResponseData = await reqHasSpu(pageNo.value, pageSize.value, categoryStore.c3Id)
  if (result.code == 200) {
    records.value = result.data.records
    total.value = result.data.total
  }
}
//添加spu 改变场景
const addSpu = () => {
  //切换场景1
  scene.value = 1
  //点击添加SPU按钮 调用子组件的方法初始化数据
  spu.value.initAddSpu(categoryStore.c3Id)
}
//修改spu
const updateSpu = (row: SpuData) => {
  //切换场景：添加与修改SPU结构SpuForm
  scene.value = 1
  //调用子组件实例方法获取完整已有的SPU数据
  spu.value.initHasSpuData(row)
}
//子组件spuform绑定的自定义事件 1子组件让父组件切换场景
const changeScene = (obj: any) => {
  //子组件spuform点击取消按钮改变场景0
  scene.value = obj.flag;
  if (obj.params == 'update') {
    //更新留在当前页
    getHasSpu(pageNo.value)
  } else {
    //添加留在第一页
    getHasSpu()
  }
  //再次获取全部的已有SPU
  getHasSpu()
}
//添加SKU按钮回调
const addSku = (row: SpuData) => {
  //点击切换场景为2
  scene.value = 2
  //调用子组件方法初始化添加sku数据
  sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}
//查看SKU列表的数据
const findSku = async (row: SpuData) => {
  let result: SkuInfoData = await reqSkuList((row.id as number));
  if (result.code == 200) {
    skuArr.value = result.data;
    //对话框显示出来
    show.value = true;
  }
}

//删除已有的SPU按钮的回调
const deleteSpu = async (row: SpuData) => {
  let result: any = await reqRemoveSpu((row.id as number));
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    });
    //获取剩余SPU数据
    getHasSpu(records.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
  }
}

//路由组件销毁前，情况仓库关于分类的数据
onBeforeUnmount(() => {
  categoryStore.$reset();
})
</script>

<style scoped></style>
