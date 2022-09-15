<template>
  <div class="agvs-setting block-item border-bottom">
    <h3>AGVS 設定</h3>
    <AGVSItemVue :agvsProps="agvsSettings"></AGVSItemVue>
  </div>
</template>

<script>
import { GetAGVSSetting } from '@/assets/APIHelper/backend';
import AGVSItemVue from './AGVSItem.vue';
export default {
  components: {
    AGVSItemVue,
  },
  data() {
    return {
      agvsSettings: {
        VenderName: "",
        ConnectionString: ""
      }
    }
  },
  mounted() {
    setTimeout(async () => {
      this.agvsSettings = await GetAGVSSetting();
    }, 100);
  }
}
</script>

<style>
</style>