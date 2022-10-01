<template>
  <div class="log-item d-flex flex-row border-bottom">
    <div>
      <el-tag effect="light" type="info" disable-transitions>{{time}}</el-tag>
    </div>
    <div style="color:white">
      <el-tag
        effect="dark"
        :type="logItem.Direction=='AGVS_TO_LAT'?'danger':'success'"
        disable-transitions
      >{{logItem.Direction}}</el-tag>
    </div>
    <div class="msg px-2 text-start">{{shortMsg}}</div>
  </div>
</template>

<script>
import moment from 'moment';
export default {
  props: {
    logItem: {
      type: Object,
      default: {
        Direction: "",
        Time: "",
        Message: ""
      }
    },
  },
  computed: {
    time() {
      return moment(this.logItem.Time).format("yyyy-MM-DD HH:mm:ss");
    },
    shortMsg() {
      var width = window.innerWidth;
      console.info(width);
      return this.logItem.Message.substring(0, width - 650) + "...";
    }
  }
}
</script>

<style scoped lang="scss">
.log-item {
  margin: 10px;
  .msg {
    font-size: 12px;
  }
}
</style>