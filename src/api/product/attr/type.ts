//全部接口返回数据都拥有ts类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
//分类ts类型
export interface CategoryObj {
  id: number | string
  name: string
  category1Id?: number
  category2Id?: number
}
//分类接口返回数据类型
export interface CategoryResponseData extends ResponseData {
  data: CategoryObj[]
}
//属性值对象ts类型
export interface AttrValue{
  id?:number,
  valueName:string
  createTime?: null,
  updateTime?: null,
  attrId?: number,
  flag?:boolean,
}
//存储属性值数组的类型
export type AttrValueList = AttrValue[]

//属性对象
export interface Attr{
  id?:number
  createTime?: null,
  updateTime?: null,
  attrName: string,
  categoryId: string|number,
  categoryLevel: number,
  attrValueList:AttrValueList,
}

//属性对象数组类型
export type AttrList = Attr[]
//属性与属性值接口返回数据类型
export interface AttrResponseData extends ResponseData{
  data:Attr[]
}
