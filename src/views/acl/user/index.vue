<template>
  <el-card style="height: 70px;">
    <el-form :inline="true" class="form">
      <el-form-item label="用户名:">
        <el-input placeholder="请输入用户名">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default">搜索</el-button>
        <el-button size="default">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0;">
    <el-button type="primary" size="default" @click="addUser">添加</el-button>
    <el-button type="danger" size="default" plain>批量删除</el-button>
    <!-- 表格 -->
    <el-table style="margin: 10px 0;" border :data="userArr">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="#" align="center" type="index"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column label="用户名字" align="center" prop="username" show-overflow-tooltip></el-table-column>
      <el-table-column label="用户名称" align="center" prop="name" show-overflow-tooltip></el-table-column>
      <el-table-column label="用户角色" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
      <el-table-column label="创建时间" align="center" show-overflow-tooltip prop="createTime"></el-table-column>
      <el-table-column label="更新时间" align="center" show-overflow-tooltip prop="updateTime"></el-table-column>
      <el-table-column label="操作" width="260px" align="center">
        <template #="{ row }">
          <el-button type="primary" size="default" icon="User">分类角色</el-button>
          <el-button type="warning" size="default" icon="Edit" @click="updateUser(row)">编辑</el-button>
          <el-button type="danger" size="default" icon="Delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
      :background="true" layout=" prev, pager, next, jumper,->,sizes,total " :total="total" @current-change="getHasUser"
      @size-change="handler" />
  </el-card>
  <!-- 抽屉结构 新增｜修改用户信息 :direction="direction"-->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>添加用户</h4>
    </template>
    <template #default>
      <el-form>
        <el-form-item label="用户姓名">
          <el-input placeholder="请输入用户姓名"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input placeholder="请输入用户昵称"></el-input>
        </el-form-item>
        <el-form-item label="用户密码">
          <el-input placeholder="请输入用户密码"></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button>取消</el-button>
        <el-button type="primary">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { reqUserInfo } from '@/api/acl/user';
import { Records, UserResponseData, User } from '@/api/acl/user/type';
let pageNo = ref<number>(1)
let pageSize = ref<number>(10)
//用户总个数
let total = ref<number>(0)
//存储全部用户数组
let userArr = ref<Records>([])
//定义响应式数据控制抽屉显示与隐藏
let drawer = ref<boolean>(false)
onMounted(() => {
  getHasUser()
})
//获取全部已有用户信息
const getHasUser = async (pager = 1) => {
  //收集当前页码
  pageNo.value = pager
  let result: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value)
  if (result.code == 200) {
    total.value = result.data.total
    userArr.value = result.data.records
  } else {

  }
}
//分页器下拉菜单自定义事件回调
const handler = () => {
  getHasUser()
}
//添加用户按钮
const addUser = () => {
  drawer.value = true
}
//编辑用户按钮
const updateUser = (row: User) => {
  drawer.value = true
}
</script>

<style scoped>
.form {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
