<template>
  <div class="agvc-view" v-loading="loading">
    <!-- {{agv_type}} / {{agv_id}} / {{agv_eqName}} /{{agv_battery}} -->
    <div class="mx-2 d-flex flex-row border-bottom">
      <span class="mx-3 py-2" style="font-size:20px;">
        <i class="bi bi-car-front px-2"></i>AGV 選擇
      </span>
      <el-form-item label prop class="flex-fill py-1">
        <el-select size="large" v-model="selectedAgvcID" @change="ChangeAGVC">
          <el-option
            v-for="agv in agvcList"
            :key="agv.Key"
            :label="`${agv.Key}(${agv.Value})`"
            :value="agv.Key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-button
        class="mx-3"
        type
        size="default"
        @click="()=>{ $router.push({ name: 'map', params: { agv_id: selectedAgvcID } });}"
      >MAP</el-button>
    </div>
    <div class="infos d-flex flex-row row border-bottom bg-light">
      <el-card class="info-block">
        <h3>ID</h3>
        <div class="content">{{agv_id}}</div>
      </el-card>
      <el-card class="info-block">
        <h3>名稱</h3>
        <div class="content">{{agv_eqName}}</div>
      </el-card>
      <el-card class="info-block">
        <h3>廠牌</h3>
        <div class="content">{{agv_type}}</div>
      </el-card>
      <el-card class="info-block">
        <h3>電量</h3>
        <div class="content">
          <el-progress :percentage="agv_battery" type="circle" :width="60"></el-progress>
        </div>
      </el-card>
    </div>

    <el-card class="my-3 mx-2">
      <div class="order-card-title my-3">
        <h3 class="text-start">Orders</h3>
        <el-button type size="default" @click="()=>{$router.push('/Orders')}">檢視所有訂單</el-button>
      </div>
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
import { GetAGVCStateByID, GetAGVCList } from "@/assets/APIHelper/backend.js";
import { GetAGVCTypeName, GetAGVSTypeName, GetConnectionStateName, GetRunningStateName, GetOrderStateName } from '@/assets/EnumsHelper';

export default {
  data() {
    return {
      loading: true,
      id: 1,
      agvcData: null,
      agvcList: [],
      selectedAgvcID: ""
    }
  },
  methods: {
    OrderStateFormat(row, col, value, index) {
      return GetOrderStateName(value);
    },
    AGVSTypeFormat(row, col, value, index) {
      return GetAGVSTypeName(value);
    },
    ChangeAGVC(selected_id) {
      this.loading = true;
      this.$router.push({ name: 'agvc', query: { agv_id: selected_id } });
      setTimeout(() => {
        this.loading = false;
      }, 400);
    }
  },
  mounted() {
    setTimeout(() => {
      GetAGVCList().then(value => {
        this.agvcList = value;
        this.selectedAgvcID = this.agv_id;
      }
      );
      GetAGVCStateByID(this.agv_id).then(value => this.agvcData = value);

      setInterval(async () => {
        this.loading = false;
        this.agvcData = await GetAGVCStateByID(this.agv_id);
      }, 1000);
    }, 400);

  },
  computed: {
    agv_id() {
      var query = this.$route.query;
      if (query.agv_id)
        return query.agv_id;
      else {
        if (this.agvcList.length != 0)
          return this.agvcList[0].Key;
        else
          return "??";
      }
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

<style scoped lang="scss">
.agvc-view {
  margin-top: 40px;
  h3 {
    font-weight: bolder;
    width: 100%;
    text-align: left;
    border-bottom: 1px solid rgb(226, 226, 226);
    padding-bottom: 15px;
  }
  .infos {
    padding: 20px;

    .info-block {
      width: 300px;
      height: 190px;
      margin: auto 4px;
      padding: 1rem;

      .content {
        padding-top: 10px;
        font-size: 30px;
      }
    }
  }

  .order-card-title {
    .el-button {
      top: -60px;
      position: relative;
      float: right;
    }
  }
}

@media screen and (max-width: 710px) {
  .agvc-view {
    .infos {
      .info-block {
        width: 100%;
        margin: 4px auto;
      }
    }
  }
}
</style>>
    