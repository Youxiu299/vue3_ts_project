//全部接口返回数据都拥有ts类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
//SPU数据的ts类型
export interface SpuData {
  category3Id: number | string
  id?: number
  spuName: string
  tmId: number | string
  description: string
  spuSaleAttrList: null | SaleAttr[] | []
  spuImageList: null | SpuImg[] | []
  spuPosterList?: null
  createTime?: string
  updateTime?: string
}
//数组：元素都是已有SPU数据类型
export type Records = SpuData[]
//定义获取已有SPU接口返回的数据ts类型
export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    pages: number
    orders: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: boolean
  }
}
//品牌数据Ts类型
export interface Trademark {
  id: number
  tmName: string
  logoUrl: string
}
//品牌接口返回数据ts类型
export interface AllTradeMark extends ResponseData {
  data: Trademark[]
}
//商品图片ts类型
export interface SpuImg {
  id?: number
  createTime?: string
  updateTime?: string
  spuId?: number
  imgName?: string
  imgUrl?: string
  name?: string
  url?: string
}
//已有的SPU的照片数据类型
export interface SupHasImg extends ResponseData {
  data: SpuImg[]
}
//已有销售属性值对象ts类型
export interface SaleAttrValue {
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrValueName: string
  saleAttrName?: string
  isChecked?: null
}
//存储已有销售属性值数组类型
export type SpuSaleAttrValueList = SaleAttrValue[]
//销售属性对象ts类型
export interface SaleAttr {
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrName: string
  spuSaleAttrValueList: SpuSaleAttrValueList
  flag?: boolean
  saleAttrValue?: string
}
//SPU已有销售属性接口返回数据ts类型
export interface SaleAttrResponseData extends ResponseData {
  data: SaleAttr[]
}
//已有的全部SPU的返回数据TS类型
export interface HasSaleArr {
  id: number
  name: string
}
export interface HasSaleArrResponseData extends ResponseData {
  data: HasSaleArr[]
}
export interface Attr {
  attrId: number | string //平台属性的ID
  valueId: number | string //属性值的ID
}

export interface saleArr {
  saleAttrId: number | string //属性ID
  saleAttrValueId: number | string //属性值的ID
}
export interface SkuData {
  category3Id: string | number //三级分类的ID
  spuId: string | number //已有的SPU的ID
  tmId: string | number //SPU品牌的ID
  skuName: string //sku名字
  price: string | number //sku价格
  weight: string | number //sku重量
  skuDesc: string //sku的描述
  skuAttrValueList?: Attr[]
  skuSaleAttrValueList?: saleArr[]
  skuDefaultImg: string //sku图片地址
}

//获取SKU数据接口的ts类型
export interface SkuInfoData extends ResponseData {
  data: SkuData[]
}
