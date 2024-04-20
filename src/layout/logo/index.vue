<template>
  <div class="logo" v-if="setting.logoHidden">
    <img :src="setting.logo" alt="" />
    <p>{{ setting.title }}</p>
  </div>
</template>

<script setup lang="ts">
//引入设置标题与logo配置文件
import setting from '@/setting'
</script>
<script lang="ts">
export default {
  name: 'Logo',
}
</script>
<style scoped lang="scss">
.logo {
  width: 100%;
  height: $base-menu-logo-height;
  display: flex;
  align-items: center;
  color: #ffffff;
  padding: 10px;
  img {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }
  p {
    font-size: $base-menu-logo-title-fontSize;
    font-weight: bold;
  }
}
</style>
