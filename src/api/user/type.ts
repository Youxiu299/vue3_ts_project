//登录接口需要携带参数ts类型
export interface loginFrom {
  username: string
  password: string
}
interface dataType {
  token?: string
  message?: string
}
//全部接口返回数据都拥有ts类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
//登录接口返回数据类型
export interface loginResponseData extends ResponseData {
  data: string
}
interface userInfo {
  userId: number
  avatar: string
  username: string
  password: string
  desc: string
  roles: string[]
  buttons: string[]
  routes: string[]
  token: string
}
//定义服务器返回用户信息相关的数据类型
interface user {
  checkUser: userInfo
}
export interface userResponseData extends ResponseData {
  data: {
    routes: string[]
    buttons: string[]
    roles: string[]
    name: string
    avatar: string
  }
}
