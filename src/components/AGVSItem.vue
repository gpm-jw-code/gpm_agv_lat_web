<template>
  <div class="agvs-item d-flex flex-row my-2 mx-2">
    <span>SPEC</span>
    <div>
      <el-tag round effect="dark" size="large">{{Spec}}</el-tag>
    </div>
    <span>IP</span>
    <div>
      <el-tag round effect="dark" size="large">{{HostIP}}</el-tag>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    agvsProps: {
      type: Object,
      default() {
        return {
          agvsType: 0,
          agvsParameters: {
            tcpParams: {
              HostIP: "192.168.0.107",
              HostPort: 5500
            }
          },
          connected: false
        }
      }
    },

  },
  computed: {
    HostIP() {
      return this.agvsProps.agvsParameters == undefined ? '' : this.agvsProps.agvsParameters.tcpParams.HostIP;
    },
    Spec() {
      if (this.agvsProps.agvsType == 0)
        return 'GPM'
      else if (this.agvsProps.agvsType == 1)
        return "晶潔能AGVS";
      else
        return 'Unknown';
    }
  }
}
</script>

<style>
.agvs-item,
.agvs-item .el-tag {
  font-size: 20px;
}

.agvs-item div {
  margin: auto 10px;
  font-weight: bold;
}
</style>