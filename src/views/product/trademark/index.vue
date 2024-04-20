<template>
  <div>
    <el-card class="box-card">
      <!-- 卡片顶部添加品牌按钮 -->
      <el-button type="primary" icon="Plus" @click="addTrademark">
        添加品牌
      </el-button>
      <!-- 表格组件 展示已有品牌数组 -->
      <!-- table->border用于设置纵向是否有边框 -->
      <el-table style="margin: 10px 0" border :data="trademarkArr">
        <!-- table-column->label设置列标题 width设置列宽 align设置列的对齐方式 -->
        <el-table-column
          label="序号"
          width="80px"
          align="center"
          type="index"
        ></el-table-column>
        <el-table-column label="品牌名称" prop="tmName"></el-table-column>
        <el-table-column label="品牌LOGO">
          <template #="{ row }">
            <img :src="row.logoUrl" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template #="{ row }">
            <el-button
              type="primary"
              icon="Edit"
              size="small"
              @click="updateTrademark(row)"
            />
            <el-popconfirm
              :title="`您确定要删除${row.tmName}?`"
              width="230px"
              icon="Delete"
              icon-color="red"
              @confirm="removeTradeMark(row.id)"
            >
              <template #reference>
                <el-button
                  type="primary"
                  icon="Delete"
                  size="small"
                ></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器组件 -->
      <!-- pagination v-model:current-page设置分页器当前页码 
      v-model:page-size:设置每页展示条数
      page-sizes:下拉菜单数据
      background	是否为分页按钮添加背景色
      layout	组件布局，子组件名用逗号分隔
    -->
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :pager-count="9"
        :page-sizes="[3, 5, 7, 9]"
        :background="true"
        layout=" prev, pager, next, jumper,->,sizes,total"
        :total="total"
        @change="getHasTrademark"
      />
    </el-card>
    <!-- 对话框组件 添加和修改品牌时使用 -->
    <el-dialog
      v-model="dialogFormVisible"
      :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
      width="500"
    >
      <el-form style="width: 70%" :rules="rules" ref="formRef">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input
            placeholder="请输入品牌名称"
            v-model="trademarkParams.tmName"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkParams.logoUrl"
              :src="trademarkParams.logoUrl"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 具名插槽 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="confirm">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqHasTrademark,
  reqAddOrUpdateTrademark,
  reqDeleteTrademark,
} from '@/api/product/trademark'
import type {
  Records,
  TradeMarkResponseData,
  TradeMark,
} from '@/api/product/trademark/type'
import { ElMessage } from 'element-plus'
import type { UploadProps } from 'element-plus'
//当前页面
let currentPage = ref<number>(1)
//每页条数
let pageSize = ref<number>(3)
//获取已有品牌数据总数
let total = ref<number>(0)
//已有品牌数据
let trademarkArr = ref<Records>([])
//控制对话框显示与隐藏
let dialogFormVisible = ref<boolean>(false)
//获取el-form实例
let formRef = ref()
//品牌名校验规则方法
const validatorTmName = (_rule: any, value: any, callBack: any) => {
  console.log('value', value)
  console.log('_rule', _rule)
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('品牌名称应大于等于两位字符'))
  }
}
//上传品牌图片校验规则方法
const validatorLogoUrl = (_rule: any, value: any, callBack: any) => {
  if (value) {
    callBack()
  } else {
    callBack(new Error('LOGO图片必须上传'))
  }
}
// 表单校验规则对象
const rules = {
  tmName: [{ required: true, trigger: 'change', validator: validatorTmName }],
  logoUrl: [{ required: true, trigger: 'blur', validator: validatorLogoUrl }],
}
//点击添加品牌按钮
const addTrademark = () => {
  dialogFormVisible.value = true
  trademarkParams.id = 0
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  //清除表单校验错误信息提示
  //两种方法 1、ts问号语法 2、nextTick()
  // formRef.value?.clearValidate('tmName')
  // formRef.value?.clearValidate('logoUrl')
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
}
//点击修改品牌按钮
const updateTrademark = (row: TradeMark) => {
  dialogFormVisible.value = true
  //es6语法合并对象
  Object.assign(trademarkParams, row)
  // trademarkParams.id = row.id
  // trademarkParams.tmName =row.tmName
  // trademarkParams.logoUrl = row.logoUrl
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
}
//对话框确定按钮
const confirm = async () => {
  //发请求之前对整个表单进行校验 校验通过后面语法继续执行
  await formRef.value.validate()
  let result: any = await reqAddOrUpdateTrademark(trademarkParams)
  if (result.code == 200) {
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功',
    })
    getHasTrademark(trademarkParams.id ? currentPage.value : 1)
  } else {
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败',
    })
    dialogFormVisible.value = false
  }
}
//对话框取消按钮
const cancel = () => {
  dialogFormVisible.value = false
}
//新增品牌数据
let trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: '',
})
//获取已有品牌接口
const getHasTrademark = async (pager = 1) => {
  currentPage.value = pager
  let result: TradeMarkResponseData = await reqHasTrademark(
    currentPage.value,
    pageSize.value,
  )
  if (result.code == 200) {
    total.value = result.data.total
    trademarkArr.value = result.data.records
  }
}
//组件挂在完毕钩子
onMounted(() => {
  getHasTrademark()
})
// 上传图片组件-》上传图片之前触发钩子
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile: {
  type: string
  size: number
}) => {
  //钩子是在图片上传成功之前触发可以约束文件类型和大小
  if (
    rawFile.type == 'image/png' ||
    rawFile.type == 'image/jpeg' ||
    rawFile.type == 'image/gif'
  ) {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件大小小于4M',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件格式必须为PNG/JPG/GIF',
    })
    return false
  }
}
//上传成功触发钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response: { data: string },
  // uploadFile: any,
) => {
  //response 当前上传图片post请求服务器返回结果
  trademarkParams.logoUrl = response.data
  //上传图片成功 清楚相对应图片校验信息
  formRef.value.clearValidate('logoUrl')
}
//气泡确认框确定按钮回调
const removeTradeMark = async (id: number) => {
  let result = await reqDeleteTrademark(id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除品牌成功',
    })
    getHasTrademark(
      trademarkArr.value.length > 1 ? currentPage.value : currentPage.value - 1,
    )
  } else {
    ElMessage({
      type: 'error',
      message: '删除品牌失败',
    })
  }
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
