<template>
  <div class="agvc-table block-item border-bottom">
    <h3>AGVC 列表</h3>
    <el-table
      :data="agvcStatus"
      row-key="agvcParameters.tcpParams.hostIP"
      :header-cell-style="header_style"
      v-loading="tableLoading"
    >
      <el-table-column label="ID" prop="ID"></el-table-column>
      <el-table-column label="AGVC Name" prop="EQName"></el-table-column>
      <el-table-column label="Connection">
        <template #default="scope">
          <div>{{scope.row.agvcParameters.tcpParams.HostIP}}:{{scope.row.agvcParameters.tcpParams.HostPort}}</div>
        </template>
      </el-table-column>
      <el-table-column label="Type" prop="agvcType" :formatter="TypeFormatter"></el-table-column>
      <el-table-column label="連線狀態" prop="agvcStates.States.EConnectionState">
        <template #default="scope">
          <el-tag
            effect="plain"
            :type="scope.row.agvcStates.States.EConnectionState==0?'success':'warning'"
          >{{ConnectionStateFormatter(scope.row.agvcStates.States.EConnectionState)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="上線狀態" prop="agvcStates.States.OnlineState"></el-table-column>
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
            :percentage="scope.row.agvcStates.BetteryState.remaining*100"
          ></el-progress>
        </template>
      </el-table-column>
      <el-table-column width="200">
        <template #default="scope">
          <el-button @click="ShowAGVCInfoPage(scope.row)">詳細內容</el-button>
          <el-button @click="ShowMapButtonHandle(scope.row)">MAP</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { GetAGVCStates } from '@/assets/APIHelper/backend';
import { GetAGVCTypeName, GetConnectionStateName, GetRunningStateName } from '@/assets/EnumsHelper';
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
      return GetAGVCTypeName(value);
    },
    ConnectionStateFormatter(value) {
      return GetConnectionStateName(value);
    },
    RunningStateFormatter(row, cell, value, index) {
      //CONNECTED, CONNECTING, DISCONNECT
      return GetRunningStateName(value);
    },
    BetteryStateFormatter(row, cell, value, index) {
      return value + " %";
    },
    ShowAGVCInfoPage(agv_state) {
      this.$router.push({ name: 'agvc', query: { agv_id: agv_state.ID } });
    },
    ShowMapButtonHandle(agv_state) {
      console.info(agv_state);
      this.$router.push({ name: 'map_view', params: { agv_id: agv_state.ID } });
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