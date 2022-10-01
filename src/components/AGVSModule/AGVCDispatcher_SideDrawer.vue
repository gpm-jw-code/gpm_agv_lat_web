<template>
  <el-drawer direction="rtl" size="20%" v-model="show">
    <agvc-dispatcher :Default_AGV_Name="Default_AGV_Name"></agvc-dispatcher>
  </el-drawer>
</template>

<script>
import AGVCDispatcherVue from './AGVCDispatcher.vue';
export default {
  props: {
    Default_AGV_Name: {
      type: String,
      default: "AGV_002"
    },
  },
  components: {
    "agvc-dispatcher": AGVCDispatcherVue,
  },
  data() {
    return {
      show: false
    }
  },
  methods: {
    Show() {
      this.show = true;
    }
  },
}
</script>

<style>
</style>