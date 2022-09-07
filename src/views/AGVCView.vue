<template>
  <div class="agvc-view bg-light" v-loading="loading">
    <!-- {{agv_type}} / {{agv_id}} / {{agv_eqName}} /{{agv_battery}} -->
    <side-menu
      ref="side_menu"
      :listData="agvcList"
      @collapseChange="(collapse)=>{menu_show=!collapse}"
    ></side-menu>
    <div class="w-100" v-bind:class="menu_show?'menu-show':'menu-hide'">
      <div class="w-100 mx-2 py-2 text-end border-bottom">
        <el-button
          class="mx-1"
          type
          size="default"
          @click="()=>{ $router.push({ name: 'map', params: { agv_id: selectedAgvcID } });}"
        >MAP</el-button>
        <el-button class="mx-1" type size="default" @click="ShowNativeInfo">原廠資訊</el-button>
      </div>
      <div class="infos d-flex flex-row row border-bottom">
        <div class="info-block">
          <h5>ID</h5>
          <div class="content">{{agv_id}}</div>
        </div>
        <div class="info-block">
          <h5>名稱</h5>
          <div class="content">{{agv_eqName}}</div>
        </div>
        <div class="info-block">
          <h5>廠牌</h5>
          <div class="content">{{agv_type}}</div>
        </div>
        <div class="info-block">
          <h5>連線狀態</h5>
          <div class="content">{{agv_ConnectedState}}</div>
        </div>
        <div class="info-block">
          <h5>訂單狀態</h5>
          <div class="content">{{agv_RunningState}}</div>
        </div>
        <div class="info-block">
          <h5>電量</h5>
          <div class="content">
            <el-progress :percentage="agv_battery" type="circle" :width="60"></el-progress>
          </div>
        </div>
      </div>
      <div class="my-2 mx-2 order-block">
        <div class="order-card-title">
          <h5>Orders</h5>
          <el-button type size="default" @click="()=>{$router.push('/Orders')}">檢視所有訂單</el-button>
        </div>
        <el-table :data="agv_orderList" row-key="OrderNo" height="430" border>
          <el-table-column label="任務名" prop="latOrderDetail.taskName"></el-table-column>
          <el-table-column label="派車廠商" prop="FromAGVS.agvsType" :formatter="AGVSTypeFormat"></el-table-column>
          <el-table-column label="接收時間" prop="RecieveTimeStamp" :formatter="TimeFormatter"></el-table-column>
          <el-table-column label="完成時間" prop="CompleteTimeStamp" :formatter="TimeFormatter"></el-table-column>
          <el-table-column label="執行狀態" prop="State" :formatter="OrderStateFormat"></el-table-column>
        </el-table>
      </div>
    </div>
    <div
      class="foot py-2"
      v-bind:class="menu_show?'menu-show':'menu-hide'"
    >?sdasasasasasasasasasasas</div>
    <native-info-viewer :agv_id="selectedAgvcID" :agv_name="agv_eqName" ref="native_info_viewer"></native-info-viewer>
  </div>
</template>

<script>
import { GetAGVCStateByID, GetAGVCList } from "@/assets/APIHelper/backend.js";
import { GetAGVCTypeName, GetAGVSTypeName, GetConnectionStateName, GetRunningStateName, GetOrderStateName } from '@/assets/EnumsHelper';
import AGVCNativeInfoViewVue from "@/components/AGVCNativeInfoView.vue";
import AGVCViewSideMenuVue from "@/components/AGVCViewSideMenu.vue";
import moment from 'moment';

export default {
  components: {
    'native-info-viewer': AGVCNativeInfoViewVue,
    'side-menu': AGVCViewSideMenuVue
  },
  data() {
    return {
      loading: true,
      id: 1,
      agvcData: null,
      agvcList: [],
      selectedAgvcID: "",
      menu_show: true
    }
  },

  methods: {

    OrderStateFormat(row, col, value, index) {
      return GetOrderStateName(value);
    },
    AGVSTypeFormat(row, col, value, index) {
      return GetAGVSTypeName(value);
    },
    TimeFormatter(row, colume, value, index) {
      return moment(value).format('yyyy-MM-DD HH:mm:ss');
    },

    ShowNativeInfo() {
      this.$refs.native_info_viewer.Open();
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
      return this.agvcData ? GetAGVCTypeName(this.agvcData.agvcType) : "-";
    },
    agv_RunningState() {
      return this.agvcData ? this.agvcData.agvcStates.States.RunningState : "-";
    },
    agv_ConnectedState() {
      return this.agvcData ? this.agvcData.agvcStates.States.ConnectionState : "-";
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

  .menu-show {
    padding-left: 250px;
  }
  h5 {
    font-weight: bolder;
    width: 100%;
    text-align: left;
    border-bottom: 1px solid rgb(226, 226, 226);
    padding-bottom: 15px;
  }
  .infos {
    padding: 20px;
  }
  .info-block,
  .order-block {
    width: 200px;
    height: 140px;
    margin: auto 4px;
    padding: 1rem;
    border-radius: 10px;
    border: 1px solid rgb(218, 218, 218);
    .content {
      padding-top: 10px;
      font-size: 20px;
    }
  }
  .order-block {
    width: 100%;
    height: 100%;
  }
  .order-card-title {
    .el-button {
      top: -50px;
      position: relative;
      float: right;
    }
  }

  .foot {
    position: fixed;
    bottom: 0;
    z-index: 3009;
    width: 100%;
    background-color: rgb(146, 146, 146);
    color: white;
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
    