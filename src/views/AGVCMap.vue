<template>
  <div class="agvc-map block-item h-100">
    <div class="d-flex flex-row">
      <h3 class="flex-fill">
        MAP OF AGV-
        <el-select size="large" v-model="selectedID">
          <el-option v-for="(type,id) in AGVCTypesInfo" :key="id" :value="id" :label="id"></el-option>
        </el-select>
      </h3>

      <span class="text-end">{{hostUrl}}</span>
      <span class="text-end">
        <el-button v-if="displayMode=='single-agv'" @click="ShowAllAgvMode">顯示所有AGV</el-button>
      </span>
    </div>
    <div class="map-display border-top bg-dark" style="height:800px">
      <div
        class="agv-spot d-flex flex-column"
        v-for="(data,id ) in RecievedData"
        :key="id"
        v-bind:style="agvSpotStyle[id].position"
      >
        <el-popover placement="top-start" width="200px">
          <template #reference>
            <span>{{id}}</span>
          </template>
          <template #default>
            <div class="popover-content">
              <div class="d-flex flex-row">
                <span>ID</span>
                <div>{{id}}</div>
              </div>
              <div class="d-flex flex-row">
                <span>Brand</span>
                <div>{{AGVCTypesInfo[id]}}</div>
              </div>
              <div class="d-flex flex-row">
                <span>操作模式</span>
                <div>{{data.States.OperationState}}</div>
              </div>
              <div class="d-flex flex-row">
                <span>上線狀態</span>
                <div>
                  <el-tag
                    effect="dark"
                    :type="data.States.OnlineState=='OFFLINE'? 'danger':'success'"
                  >{{data.States.OnlineState}}</el-tag>
                </div>
              </div>
              <div class="d-flex flex-row">
                <span>
                  電量
                  <i class="bi bi-battery"></i>
                </span>
                <div>
                  <el-progress
                    :text-inside="true"
                    :stroke-width="26"
                    :percentage="data.BetteryState.remaining"
                  ></el-progress>
                </div>
              </div>
            </div>
          </template>
        </el-popover>
        <i
          v-bind:style="agvSpotStyle[id].rotation"
          v-bind:class="[data.States.RunningState]"
          class="direction-indicator bi bi-arrow-up-circle"
        ></i>
        <div
          class="global-coordinate-display"
        >({{data.MapStates.globalCoordinate.x}},{{data.MapStates.globalCoordinate.y}},{{data.MapStates.globalCoordinate.r}})</div>
      </div>
    </div>
  </div>
</template>

<script>
import { HostUrl, GetAGVCTypes } from '@/assets/APIHelper/backend.js'
export default {
  data() {
    return {
      websocket: null,
      websocketConnected: false,
      RecievedData: {},
      agvSpotStyle: {

      },
      selectedID: "",
      AGVCTypesInfo: {}
    }
  },
  computed: {
    agv_id() {
      return this.$route.params.agv_id == undefined ? "all" : this.$route.params.agv_id
    },
    hostUrl() {
      return HostUrl.replace('http', 'ws');
    },
    displayMode() {
      return this.$route.params.agv_id == undefined ? 'all-agvs' : 'single-agv'
    }
  },
  methods: {
    WebsocketIni() {
      this.websocket = new WebSocket(`${this.hostUrl}/map?agv_id=${this.agv_id}`);
      this.websocket.onopen = () => { this.websocketConnected = true; }
      this.websocket.onmessage = (evt) => this.HandleWSData(evt);
    },
    HandleWSData(evt) {
      this.RecievedData = JSON.parse(evt.data);
      //.MapStates.globalCoordinate
      Object.keys(this.RecievedData).forEach(agv_id => {
        var globalCoordinate = this.RecievedData[agv_id].MapStates.globalCoordinate;
        if (this.agvSpotStyle[agv_id] == undefined) {
          this.agvSpotStyle[agv_id] = { position: {}, rotation: {} }
        }
        this.agvSpotStyle[agv_id].position.top = globalCoordinate.x + 'px';
        this.agvSpotStyle[agv_id].position.left = globalCoordinate.y + 'px';
        this.agvSpotStyle[agv_id].rotation.transform = `rotateZ(${globalCoordinate.r}deg)`;//: 'rotate(0deg)' 
      });
      this.afvSpotStyle

    },
    ShowAllAgvMode() {
      location.href = '/map_all'
    }
  },
  mounted() {
    this.selectedID = this.agv_id;
    GetAGVCTypes().then(ret => {
      this.AGVCTypesInfo = ret;
      this.WebsocketIni();
    });
  }
}
</script>

<style>
.map-display {
  color: white;
  position: absolute;
  width: 1600px;
  margin: 10px;
}
.map-display span {
  position: relative;
  margin-top: -15px;
  right: 16px;
}
.map-display .agv-spot {
  width: 20px;
  height: 20px;
  position: absolute;
  /* background-color: red; */
}

.map-display .agv-spot .direction-indicator {
  color: red;
  font-size: 30px;
  margin: 0px;
  padding: 0px;
}

.map-display .agv-spot .IDLE {
  color: grey;
}
.map-display .agv-spot .RUNNING {
  color: rgb(38, 212, 38);
}

.map-display .global-coordinate-display {
  font-size: 9px;
  color: grey;
  position: relative;
  right: 32px;
}

.popover-content span {
  width: 70px;
}
</style>