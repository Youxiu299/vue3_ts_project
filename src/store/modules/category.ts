//分类小仓库
import { defineStore } from 'pinia'
//引入分类接口方法
import { reqC1, reqC2, reqC3 } from '@/api/product/attr'
import type { CategoryState } from './types/type'
import type { CategoryResponseData } from '@/api/product/attr/type'

let useCategoryStore = defineStore('Category', {
  state: (): CategoryState => {
    return {
      c1Arr: [],
      c1Id: '',
      c2Arr: [],
      c2Id: '',
      c3Arr: [],
      c3Id: '',
    }
  },
  actions: {
    async getC1() {
      //获取一级分类数据
      let result: CategoryResponseData = await reqC1()
      if (result.code == 200) {
        this.c1Arr = result.data
      } else {
      }
    },
    async getC2() {
      let result: CategoryResponseData = await reqC2(this.c1Id)
      if (result.code == 200) {
        this.c2Arr = result.data
      } else {
      }
    },
    async getC3() {
      let result: CategoryResponseData = await reqC3(this.c2Id)
      if (result.code == 200) {
        this.c3Arr = result.data
      } else {
      }
    },
  },
})
export default useCategoryStore
