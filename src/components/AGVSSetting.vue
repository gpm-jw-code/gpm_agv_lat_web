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
        VenderName: "Fetching...",
        ConnectionString: "Fetching...",
      },
      Backend_Connected: false,
      ReconnectingFlag: 0
    }
  },
  methods: {
    async Reconnect() {
      this.ReconnectingFlag = 1;
      await this.FetchData();
    },
    async FetchData() {
      setTimeout(async () => {
        GetAGVSSetting().then(dat => {
          this.agvsSettings = dat;
          this.Backend_Connected = true;
          this.ShowReconnectNoti();
          this.$emit('backend_connected', true);
        }).catch(er => {
          this.Backend_Connected = false;
          this.$emit('backend_connected', false);
          this.Reconnect();
        });
      }, 100);
    },
    ShowReconnectNoti() {
      if (this.ReconnectingFlag == 1) {
        this.ReconnectingFlag = 0;
        this.$notify.success({
          title: 'Connection Infomation',
          message: '與服務器的連線已經恢復',
          duration: '4500',
          position: 'top-right',
          showClose: 'true',
        });
      }
    }
  },
  mounted() {
    this.FetchData();
  }
}
</script>

<style>
</style>