//创建用户相关的小仓库
import { defineStore } from 'pinia'
//引入接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
//引入数据类型
import type {
  loginFrom,
  loginResponseData,
  userResponseData,
} from '@/api/user/type'
import type { UserState } from './types/type'
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
//引入路由（常量路由）
import { constantRoute } from '@/router/routers'
//创建用户小仓库
let useUserStore = defineStore('User', {
  //小仓库存储数据地方
  state: (): UserState => {
    return {
      token: GET_TOKEN(),
      menuRoutes: constantRoute, //仓库存储生成菜单需要数组（路由）
      username: '',
      avatar: '',
    }
  },
  //异步|逻辑
  actions: {
    //用户登录的方法
    async userLogin(data: loginFrom) {
      //登录请求
      console.log('data', data)
      let result: loginResponseData = await reqLogin(data)
      console.log('result', result)
      if (result.code == 200) {
        //由于pinia|vuex存储数据其实利用js对象
        this.token = result.data as string
        //本地存储持久化
        SET_TOKEN(result.data as string)
        localStorage.setItem('TOKEN', result.data as string)
        //保证当前async函数返回一个成功的promise
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data))
      }
    },
    //获取用户信息
    async userInfo() {
      console.log('token', this.token)
      //获取用户信息进行存储仓库当中[用户头像、用户名]
      let result: userResponseData = await reqUserInfo()
      console.log('result', result)
      if (result.code == 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    //退出登录
    async userLogout() {
      let result: any = await reqLogout()
      if (result.code == 200) {
        this.token = ''
        this.username = ''
        this.avatar = ''
        REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
  },
  getters: {},
})
//对外暴露
export default useUserStore
