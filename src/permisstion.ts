//路由鉴权 项目当中路由在什么条件下可以访问什么条件下不可访问
import router from '@/router'
import setting from './setting'
import nprogress from 'nprogress'
//引入进度条样式
import 'nprogress/nprogress.css'
//取消加载小圆圈
nprogress.configure({ showSpinner: false })
//获取用户小仓库token判断用户是否登录成功
import useUserStore from './store/modules/user'
import pinia from './store'
let userStore = useUserStore(pinia)
//全局守卫 项目中任意路由切换都会触发的钩子
//全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  //访问页面标题
  document.title = `${setting.title} - ${to.meta.title}`
  //访问某个路由之前的守卫
  /**
   * to:将要访问哪个路由
   * from:从哪个路由而来
   * next:路由放行函数
   */
  nprogress.start()
  //获取token判断是否登录
  let token = userStore.token
  let username = userStore.username
  if (token) {
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      //登陆成功访问除登录路由之外的路由
      if (username) {
        //由用户信息直接放行
        next()
      } else {
        try {
          //获取用户信息后放行
          await userStore.userInfo()
          next()
        } catch (error) {
          //token过期获取不到用户信息| 用户手动修改本地token
          await userStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})
//全局后置守卫
router.afterEach((to: any, from: any, next: any) => {
  nprogress.done()
})
//任意路由切换实现进度条业务 --nprogress
//路由鉴权（路由组件访问权限的设置）
//全部路由组件：登录|404|任意路由|首页|数据大屏|权限管理（三个子路由）|商品管理（四个子路由）
//未登录：只可访问login登录页面
//已登录：不可访问login
