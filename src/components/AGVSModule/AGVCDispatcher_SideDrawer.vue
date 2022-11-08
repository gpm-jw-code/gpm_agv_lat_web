<template>
  <el-drawer direction="rtl" size="30%" v-model="show">
    <agvc-dispatcher
      :stations="stations"
      :Default_AGV_Name="Default_AGV_Name"
      :agvc_eq_names="agvc_eq_names"
    ></agvc-dispatcher>
  </el-drawer>
</template>

<script>
import AGVCDispatcherVue from './AGVCDispatcher.vue';
import { GetAGVCList } from '@/assets/APIHelper/backend.js'

export default {
  props: {
    Default_AGV_Name: {
      type: String,
      default: "AGV_002"
    },
    stations: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  components: {
    "agvc-dispatcher": AGVCDispatcherVue,
  },
  data() {
    return {
      show: false,
      agvc_eq_names: []
    }
  },
  methods: {
    async UpdateAGVCList() {
      var a = await GetAGVCList();
      console.info(a);
      this.agvc_eq_names = a.map(item => item.Value.EQName);
    },
    Show() {
      this.UpdateAGVCList();
      this.show = true;
    }
  },
}
</script>

<style>
</style>