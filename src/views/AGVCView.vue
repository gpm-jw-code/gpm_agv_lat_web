<template>
  <div class="agvc-view">
    <!-- {{agv_type}} / {{agv_id}} / {{agv_eqName}} /{{agv_battery}} -->
    <div class="infos d-flex flex-row border-bottom bg-light">
      <el-card class="info-block">
        <template #header>
          <h3>ID</h3>
        </template>
        <div class="content">{{agv_id}}</div>
      </el-card>
      <el-card class="info-block">
        <template #header>
          <h3>名稱</h3>
        </template>
        <div class="content">{{agv_eqName}}</div>
      </el-card>
      <el-card class="info-block">
        <template #header>
          <h3>廠牌</h3>
        </template>
        <div class="content">{{agv_type}}</div>
      </el-card>
      <el-card class="info-block">
        <template #header>
          <h3>電量</h3>
        </template>
        <div class="content">
          <div style="position:relative;top:-26px">
            <el-progress :percentage="agv_battery" type="circle" :width="60"></el-progress>
          </div>
        </div>
      </el-card>
    </div>

    <el-card class="my-3 mx-4">
      <h3>Orders</h3>
      <el-table :data="agv_orderList" row-key="OrderNo" height="450">
        <el-table-column label="任務名" prop="latOrderDetail.taskName"></el-table-column>
        <el-table-column label="派車廠商" prop="FromAGVS.agvsType" :formatter="AGVSTypeFormat"></el-table-column>
        <el-table-column label="接收時間" prop="RecieveTimeStamp"></el-table-column>
        <el-table-column label="完成時間" prop="CompleteTimeStamp"></el-table-column>
        <el-table-column label="執行狀態" prop="State" :formatter="OrderStateFormat"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { GetAGVCStateByID } from "@/assets/APIHelper/backend.js";
import { GetAGVCTypeName, GetAGVSTypeName, GetConnectionStateName, GetRunningStateName, GetOrderStateName } from '@/assets/EnumsHelper';

export default {
  data() {
    return {
      id: 1,
      agvcData: null
    }
  },
  methods: {
    OrderStateFormat(row, col, value, index) {
      return GetOrderStateName(value);
    },
    AGVSTypeFormat(row, col, value, index) {
      return GetAGVSTypeName(value);
    },
  },
  mounted() {
    setInterval(async () => {
      this.agvcData = await GetAGVCStateByID(this.agv_id);
    }, 1000);
  },
  computed: {
    agv_id() {
      return this.$route.query.agv_id;
    },
    /**種類 */
    agv_type() {
      return this.agvcData ? GetAGVCTypeName(this.agvcData.agvcType) : "KN";
    },
    /**電量 */
    agv_battery() {
      return this.agvcData ? this.agvcData.agvcStates.BetteryState.remaining : -1;
    },
    agv_eqName() {
      return this.agvcData ? this.agvcData.EQName : -1;
    },
    agv_orderList() {
      if (!this.agvcData)
        return [];
      if (!this.agvcData.orderList_LAT)
        return [];
      return this.agvcData.orderList_LAT;
    }
  }
}
</script>

<style scoped lang="sass">
.agvc-view
    margin-top: 20px
    div
        padding: 20px
    .infos
        .info-block
            width: 330px
            height: 200px
            margin: auto 4px
            padding: 1rem
            h3
                font-weight: bolder
            .el-card__header
                float: left
                text-align: left
            .content
                font-size: 30px
                position: relative
                top: -30px
</style>>
    