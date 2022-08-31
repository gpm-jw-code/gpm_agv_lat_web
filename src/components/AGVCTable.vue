<template>
  <div class="agvc-table block-item">
    <h3>AGVC 列表</h3>
    <el-table
      :data="agvcStatus"
      row-key="agvcParameters.tcpParams.hostIP"
      :header-cell-style="header_style"
      v-loading="tableLoading"
    >
      <el-table-column label="ID" prop="ID"></el-table-column>
      <el-table-column label="Connection">
        <template #default="scope">
          <div>{{scope.row.agvcParameters.tcpParams.HostIP}}:{{scope.row.agvcParameters.tcpParams.HostPort}}</div>
        </template>
      </el-table-column>
      <el-table-column label="Type" prop="agvcType" :formatter="TypeFormatter"></el-table-column>
      <el-table-column
        label="連線狀態"
        prop="agvcStates.States.EConnectionState"
        :formatter="ConnectionStateFormatter"
      ></el-table-column>
      <el-table-column
        label="工作狀態"
        prop="agvcStates.States.ERunningState"
        :formatter="RunningStateFormatter"
      ></el-table-column>
      <el-table-column label="電量">
        <template #default="scope">
          <el-progress
            type="circle"
            :width="45"
            :percentage="scope.row.agvcStates.BetteryState.remaining"
          ></el-progress>
        </template>
      </el-table-column>
      <el-table-column width="90">
        <template #default="scope">
          <el-button @click="ShowMapButtonHandle(scope.row)">MAP</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { GetAGVCStates } from '@/assets/APIHelper/backend';
export default {

  data() {
    return {
      tableLoading: true,
      agvcStatus: [],
      header_style: {
        backgroundColor: 'black',
        color: 'white'
      }
    }
  },
  methods: {
    TypeFormatter(row, cell, value, index) {
      //CONNECTED, CONNECTING, DISCONNECT
      if (value == 0)
        return 'GPM推高機'
      else if (value == 1)
        return '罡豪潛遁'
      else
        return 'Unknown'
    },
    ConnectionStateFormatter(row, cell, value, index) {
      //CONNECTED, CONNECTING, DISCONNECT
      if (value == 0)
        return 'Connected'
      else if (value == 1)
        return 'Connecting'
      else
        return 'Disconnect'
    },
    RunningStateFormatter(row, cell, value, index) {
      //CONNECTED, CONNECTING, DISCONNECT
      if (value == 0)
        return 'Idle'
      else
        return 'Running'
    },
    BetteryStateFormatter(row, cell, value, index) {
      return value + " %";
    },
    ShowMapButtonHandle(agv_state) {
      console.info(agv_state);
      this.$router.push({ name: 'map', params: { agv_id: agv_state.ID } });
    }
  },
  mounted() {
    setTimeout(async () => {
      setInterval(async () => {
        this.agvcStatus = await GetAGVCStates();
        this.tableLoading = false;
      }, 1000)
    }, 10);
  }
}
</script>

<style>
</style>