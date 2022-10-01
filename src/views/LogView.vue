<template>
  <div class="log-view my-5 border">
    <log-item v-for="log in logItemList" :key="log.Time" :logItem="log"></log-item>
    <div class="fix-in-bottom">
      <log-item :logItem="newestlog"></log-item>
    </div>
  </div>
</template>

<script>
import { HostUrl } from '@/assets/APIHelper/backend';
import LogItemVue from '@/components/LogView/LogItem.vue';
export default {
  components: {
    "log-item": LogItemVue,
  },
  data() {
    return {
      logItemList: []
    }
  },
  methods: {
    WebsocketConnect() {
      var ws = new WebSocket(this.wsHost + "/messageHsLog");
      ws.onopen = () => console.info('log ws connected');
      ws.onmessage = (event) => {
        this.WsDataHandle(JSON.parse(event.data))
      };
    },
    WsDataHandle(logItem) {
      if (this.logItemList.length > 100) {
        this.logItemList = []
      }
      this.logItemList.push(logItem);
    }
  },
  mounted() {
    console.info('ws host:', this.wsHost);
    this.WebsocketConnect();
  },

  computed: {
    wsHost() {
      return HostUrl.replaceAll("http", "ws");
    },
    newestlog() {
      return this.logItemList.at(this.logItemList.length - 1)
    }
  },
}

</script>

<style scoped lang="scss">
.log-view {
  height: 100%;

  .fix-in-bottom {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 60px;
    background-color: black;
    opacity: 0.87;
    color: white;
  }
}
</style>