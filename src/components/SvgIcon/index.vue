<template>
  <!-- svg：图标外层容器节点，内部需要与use标签结合使用 -->
  <svg :style="{ width, height }">
    <!-- xlink：href执行用哪一个图标 属性值务必#icon-图标名 fill属性可以修改图标颜色 -->
    <use :xlink:href="prefix + name" :fill="color"></use>
  </svg>
</template>

<script setup lang="ts">
//接受父组件传递过来的参数
defineProps({
  //xlink：href属性值的前缀
  prefix: {
    type: String,
    default: '#icon-',
  },
  //提供使用的图标的名字
  name: String,
  //接受父组件传递的颜色
  color: {
    type: String,
    default: '',
  },
  //接受父组件传递过来的图标的宽度
  width: {
    type: String,
    default: '16px',
  },
  //接受父组件传递过来的图标的高度
  height: {
    type: String,
    default: '16px',
  },
})
</script>

<style scoped></style>
