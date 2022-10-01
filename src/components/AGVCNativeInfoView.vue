<template>
  <el-drawer v-model="draw_show" :direction="direction" size="50%">
    <template #header="{titleId}">
      <div class="text-start" :id="titleId">
        <h3>{{agv_name}}({{agv_id}})</h3>
      </div>
    </template>
    <template #default>
      <div class="bg-light h-100">
        <json-viewer
          class="text-start"
          :value="nativeData"
          :expand-depth="4"
          copyable
          boxed
          expanded
        ></json-viewer>
      </div>
    </template>
  </el-drawer>
</template>

<script>
import { GetAGVCNativeDatas } from '@/assets/APIHelper/backend';
export default {
  props: {
    agv_id: {
      type: String,
      default: ""
    },
    agv_name: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      draw_show: false,
      direction: "rtl",
      nativeData: {}
    }
  },
  methods: {
    Open() {

      setInterval(() => {
        GetAGVCNativeDatas(this.agv_name).then(agvcNativeData => {
          this.nativeData = agvcNativeData;
        });
      }, 1000);

      this.direction = window.innerWidth > 500 ? 'rtl' : 'btt';
      this.draw_show = true;
    }
  },
  mounted() {
    this.direction = window.innerWidth > 500 ? 'rtl' : 'btt';
  }
}
</script>

<style>
</style>