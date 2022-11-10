<template>
  <div class="agvc-view bg-light">
    <b-alert v-model="backend_disconnected" variant="danger">與後端服務器連線發生異常!</b-alert>
    <side-menu
      ref="side_menu"
      :listData="agvcList"
      @collapseChange="(collapse)=>{menu_show=!collapse}"
    ></side-menu>
    <b-alert v-model="showDismissibleAlert" variant="danger">AGVC-{{agv_eqName}}尚未完成連線!</b-alert>
    <div class="w-100" v-bind:class="menu_show?'menu-show':'menu-hide'">
      <div class="actions-button-group w-100 mx-2 py-2 text-end border-bottom">
        <i class="bi bi-car-front float-start" style="font-size:1.5rem"></i>
        <el-button
          v-if="agv_RunningState=='RUNNING'"
          class="mx-1 float-start"
          type="danger"
          size="default"
          @click="CancelNavigating()"
        >取消導航</el-button>

        <el-button
          class="mx-1"
          type
          size="default"
          @click="()=>{ $router.push({ name: 'map_view', params: { agv_id: selectedAgvcID } });}"
        >
          <i class="bi bi-pin-map-fill"></i>MAP
        </el-button>
        <el-button class="mx-1" type size="default" @click="ShowNativeInfo">
          <i class="bi bi-info-circle-fill"></i>原廠資訊
        </el-button>
        <el-button class="mx-1" type size="default" @click="()=>{$refs.agvs_side.Show()}">
          <i class="bi bi-minecart"></i>導航
        </el-button>
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
          <div class="content" v-bind:class="ConnectedStateCss">{{agv_ConnectedState}}</div>
        </div>

        <div class="info-block" v-loading="onlineStateLoading">
          <h5>上線狀態</h5>
          <div class="content">
            <div v-bind:class="OnlineStateStateCss">{{agv_OnlineState}}</div>
            <el-button
              @click="OnlineStateSwitch()"
            >切換為 {{agv_OnlineState=='ONLINE'?'OFFLINE':'ONLINE'}}</el-button>
          </div>
        </div>
        <div class="info-block">
          <h5>訂單狀態</h5>
          <div class="content">{{agv_RunningState}}</div>
        </div>
        <div class="info-block alarm-block">
          <h5>警報狀態</h5>
          <div class="content">
            <div v-if="NormalNow">
              <el-tag effect="plain" size="large" type="success">Normal</el-tag>
            </div>
            <div v-else class="text-start">
              <el-tag effect="plain" size="large" v-show="FatalNow" type="danger">Fatal</el-tag>
              <el-tag effect="plain" size="large" v-show="ErrorNow" type="danger">Error</el-tag>
              <el-tag effect="plain" size="large" v-show="WarningNow" type="warning">Warning</el-tag>
              <el-tag effect="plain" size="large" v-show="NoticeNow" type="warning">Notice</el-tag>
            </div>
          </div>
        </div>
        <div class="info-block">
          <h5>當前地圖</h5>
          <div class="content">
            <u>{{agv_currentMapName}}</u>
          </div>
        </div>
        <div class="info-block">
          <h5>所在站點</h5>
          <div class="content">
            <u>{{agv_currentStation}}</u>
          </div>
        </div>
        <div class="info-block">
          <h5>電量</h5>
          <div class="content">
            <el-progress
              :color="battery_color"
              :percentage="agv_battery"
              type="line"
              :stroke-width="22"
              :width="60"
              :text-inside="true"
            >
              <span>{{agv_battery}}%</span>
            </el-progress>
            <el-tag v-if="agv_charging" effect="plain" type="danger">充電中</el-tag>
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
          <el-table-column label>
            <template #default="scope">
              <el-button>手動完成任務</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div
      v-show="false"
      class="foot py-2"
      v-bind:class="menu_show?'menu-show':'menu-hide'"
    >?sdasasasasasasasasasasas</div>
    <native-info-viewer :agv_id="selectedAgvcID" :agv_name="agv_eqName" ref="native_info_viewer"></native-info-viewer>
    <agvs-drawer :Default_AGV_Name="agv_eqName" :stations="stations" ref="agvs_side"></agvs-drawer>
  </div>
</template>

<script>
import { GetAGVCStateByID, GetAGVCList, GetMapInfos, OnlineStateSwitch } from "@/assets/APIHelper/backend.js";
import { AGVC_REST } from '@/assets/APIHelper/kingGallentEmu.js'
import { GetAGVCTypeName, GetAGVSTypeName, GetConnectionStateName, GetRunningStateName, GetOrderStateName } from '@/assets/EnumsHelper';
import AGVCNativeInfoViewVue from "@/components/AGVCNativeInfoView.vue";
import AGVCViewSideMenuVue from "@/components/AGVCViewSideMenu.vue";
import moment from 'moment';
import AGVCDispatcher_SideDrawerVue from "@/components/AGVSModule/AGVCDispatcher_SideDrawer.vue";
import { ElNotification, ElMessageBox } from 'element-plus'

export default {
  components: {
    'native-info-viewer': AGVCNativeInfoViewVue,
    'side-menu': AGVCViewSideMenuVue,
    'agvs-drawer': AGVCDispatcher_SideDrawerVue
  },
  data() {
    return {
      loading: true,
      id: 1,
      agvcData: null,
      agvcList: [],
      selectedAgvcID: "",
      menu_show: true,
      map_data: {},
      backend_disconnected: false,
      agvclist_fetch_timer: null,
      onlineStateLoading: false,
      currentStation: 316
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
    },
    async CancelNavigating() {
      var ret = await AGVC_REST(this.agvcData.EQName)
    },
    DownloadAgvcListTimer() {
      this.agvclist_fetch_timer = setInterval(() => {
        GetAGVCList().then(value => {
          this.agvcList = value;
        })
      }, 1000);
    },
    async OnlineStateSwitch() {
      var modeToSwitch = this.agv_OnlineState == 'ONLINE' ? 0 : 1;

      ElMessageBox.prompt('目前站點?', 'Station ID', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        inputValue: this.currentStation
      }).then(({ value }) => {
        this.currentStation = value;
        this.onlineStateLoading = true;
        OnlineStateSwitch(this.agvcData.EQName, modeToSwitch, value).then((mode) => {
          if (mode != modeToSwitch) {
            ElNotification({
              title: 'ONLINE STATE CHANGE',
              message: `AGVC ${modeToSwitch == 0 ? 'Offline' : 'Online'} 失敗`,
              type: 'error',
            })
          } else {
            ElNotification({
              title: 'ONLINE STATE CHANGE',
              message: `AGVC ${modeToSwitch == 0 ? 'Offline' : 'Online'} 成功`,
              type: 'success',
            })
          }
          this.onlineStateLoading = false;

        }).catch(er => {
          this.onlineStateLoading = false;
          ElNotification({
            title: 'ONLINE STATE CHANGE',
            message: `AGVC ${modeToSwitch == 0 ? 'Offline' : 'Online'} 失敗|${er.toString()}`,
            type: 'error',
          })
        });

      })


    }
  },
  mounted() {
    setTimeout(() => {
      GetMapInfos().then(value => {
        this.map_data = value;


        GetAGVCList().then(value => {
          this.agvcList = value;
          this.selectedAgvcID = this.agv_id;
          this.DownloadAgvcListTimer();
        })

        GetAGVCStateByID(this.agv_id).then(value => this.agvcData = value);
        setInterval(async () => {
          this.loading = false;
          this.agvcData = await GetAGVCStateByID(this.agv_id);
        }, 1000);
      }).catch(err => {
        this.backend_disconnected = true;
      });


    }, 400);

  },
  unmounted() {
    clearInterval(this.agvclist_fetch_timer);
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
    showDismissibleAlert() {
      return this.agv_ConnectedState == "CONNECTING";
    },
    /**種類 */
    agv_type() {
      return this.agvcData ? GetAGVCTypeName(this.agvcData.agvcType) : "-";
    },
    agv_OnlineState() {
      return this.agvcData ? this.agvcData.agvcStates.States.OnlineState : "-";
    },
    OnlineStateStateCss() {
      if (this.agv_OnlineState == 'ONLINE')
        return 'normal'
      else
        return 'error'
    },
    agv_RunningState() {
      return this.agvcData ? this.agvcData.agvcStates.States.RunningState : "-";
    },
    agv_ConnectedState() {
      return this.agvcData ? this.agvcData.agvcStates.States.ConnectionState : "-";
    },
    ConnectedStateCss() {

      if (this.agv_ConnectedState == "CONNECTED")
        return 'normal'
      else
        return 'error'
    },
    agv_currentMapName() {
      return this.agvcData ? this.agvcData.agvcStates.MapStates.currentMapInfo.name : "-";
    },
    agv_currentStation() {
      var stationID = this.agvcData ? this.agvcData.agvcStates.MapStates.currentStationID : "Unknown";
      if (stationID == 'Navigating') {
        var navigateInfo = this.agvcData.agvcStates.MapStates.navigationState;
        return `前往 ${navigateInfo.targetStationID}`;
      } else
        return stationID;
    },
    /**電量 */
    agv_battery() {
      return this.agvcData ? Number.parseInt((this.agvcData.agvcStates.BetteryState.remaining * 100).toFixed(0)) : -1;
    },
    agv_charging() {
      return this.agvcData ? this.agvcData.agvcStates.BetteryState.charging : false;
    },
    battery_color() {
      if (this.agv_battery > 70)
        return 'green'
      else if (this.agv_battery > 50)
        return 'rgb(76,199,45)'
      else if (this.agv_battery > 20)
        return 'orange'
      else
        return 'red'
    },
    agv_eqName() {
      return this.agvcData ? this.agvcData.EQName : -1;
    },
    agv_orderList() {
      if (!this.agvcData)
        return [];
      if (!this.agvcData.orderList_LAT)
        return [];
      return this.agvcData.orderList_LAT.reverse();
    },
    agv_alarm_state() {
      return this.agvcData ? this.agvcData.agvcStates.AlarmState : {};
    },
    FatalNow() {
      if (this.agv_alarm_state.NewestFatals == undefined)
        return false;
      return this.agv_alarm_state.NewestFatals.length != 0;
    },
    ErrorNow() {

      if (this.agv_alarm_state.NewestErrors == undefined)
        return false;
      return this.agv_alarm_state.NewestErrors.length != 0;
    },
    WarningNow() {

      if (this.agv_alarm_state.NewestWarnings == undefined)
        return false;
      return this.agv_alarm_state.NewestWarnings.length != 0;
    },
    NoticeNow() {
      if (this.agv_alarm_state.NewestNotices == undefined)
        return false;
      return this.agv_alarm_state.NewestNotices.length != 0;
    },
    NormalNow() {
      return !this.FatalNow && !this.ErrorNow && !this.WarningNow && !this.NoticeNow;
    },
    stations() {
      return this.agvcData ? this.agvcData.agvcStates.MapStates.currentMapInfo.station_id_list : [];
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
  .actions-button-group {
    i {
      margin-right: 5px;
    }
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
    margin: 2px 4px;
    padding: 1rem;
    border-radius: 10px;
    border: 1px solid rgb(218, 218, 218);
    .content {
      padding-top: 10px;
      font-size: 20px;

      word-wrap: break-word;
      white-space: pre-wrap;
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

  .normal {
    color: green;
  }
  .warning {
    color: orange;
  }

  .error {
    color: red;
  }
}

@media screen and (max-width: 710px) {
  .agvc-view {
    .infos {
      .info-block {
        width: 100%;
        margin: 6px auto;
      }
    }
  }
}
</style>>
    