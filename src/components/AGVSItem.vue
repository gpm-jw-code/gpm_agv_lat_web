<template>
  <div class="agvs-item d-flex flex-row my-2 mx-2">
    <div class="d-flex flex-row">
      <span>Provider</span>
      <div class="mx-3">
        <el-tag round effect="dark" size="large">{{agvsProps.VenderName}}</el-tag>
      </div>
    </div>
    <div class="d-flex flex-row">
      <span>Connection</span>
      <div class="mx-3">
        <el-tag round effect="dark" size="large">{{agvsProps.ConnectionString}}</el-tag>
      </div>
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
          VenderName: "",
          ConnectionString: ""
        }
      }
    },

  },
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