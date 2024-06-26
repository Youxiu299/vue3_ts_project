//品牌管理模块接口
import request from '@/utils/request'
import type { TradeMarkResponseData, TradeMark } from './type'
//品牌管理模块接口地址
enum API {
  //获取已有品牌接口
  TRADEMARK_URL = '/admin/product/baseTrademark/',
  //添加品牌
  ADDTRADEMARK_URL = '/admin/product/baseTrademark/save',
  //修改品牌
  UPDATETRADEMARK_URL = '/admin/product/baseTrademark/update',
  //删除品牌
  DELETE_URL = '/admin/product/baseTrademark/remove',
}
//获取已有品牌接口方法
export const reqHasTrademark = (page: number, limit: number) =>
  request.get<any, TradeMarkResponseData>(
    API.TRADEMARK_URL + `${page}/${limit}`,
  )
//添加与修改品牌接口方法
export const reqAddOrUpdateTrademark = (data: TradeMark) => {
  //修改
  if (data.id) {
    return request.put<any, any>(API.UPDATETRADEMARK_URL, data)
  } else {
    //新增
    return request.post<any, any>(API.ADDTRADEMARK_URL, data)
  }
}
//删除某一个已有品牌
export const reqDeleteTrademark = (id: number) =>
  request.delete<any, any>(API.DELETE_URL + id)
