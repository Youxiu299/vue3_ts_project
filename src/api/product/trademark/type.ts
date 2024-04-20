//全部接口返回数据都拥有ts类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
//已有品牌ts数据类型
export interface TradeMark {
  id?: number
  tmName: string
  logoUrl: string
}
//包含全部数据品牌的ts类型
export type Records = TradeMark[]

//获取已有全部品牌的数据ts类型
export interface TradeMarkResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    orders: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: boolean
    pages: number
  }
}
