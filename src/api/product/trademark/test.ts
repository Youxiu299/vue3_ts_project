export interface RootObject {
  code: number
  message: string
  data: Data
  ok: boolean
}

export interface Data {
  records: Record[]
  total: number
  size: number
  current: number
  orders: any[]
  optimizeCountSql: boolean
  hitCount: boolean
  countId?: any
  maxLimit?: any
  searchCount: boolean
  pages: number
}

export interface Record {
  id: number
  createTime: string
  updateTime: string
  tmName: string
  logoUrl: string
}
