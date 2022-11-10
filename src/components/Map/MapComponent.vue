<template>
  <div class="map-comp w-100 h-100">
    <div class="header w-100 d-flex flex-row">
      <!-- <el-tag class effect="dark" type="success" size="medium">{{map_info.name}}</el-tag> -->
      <div class="flex-fill text-end px-3">
        <span>{{agvc_names.length}} 部車</span>
        <span class="mx-1">|</span>
        <span>{{map_info.stations.length}} 個站點</span>
      </div>
    </div>
    <div class="d-flex flex-row h-100">
      <div class="flex-fill bg-dark" ref="map">
        <div class="map-base bg-light" v-bind:style="map_style">
          <div class="map-image" v-bind:style="map_image_style">??</div>
          <div class="grid-item" v-for="i in grid_ary" :key="i"></div>
          <div class="station-spot center" v-bind:style="center">+</div>

          <div
            class="station-spot"
            v-bind:class="station.type"
            v-bind:style="station_style(station.id)"
            v-for="station in map_info.stations"
            :key="station.id"
          >
            <el-tooltip :content="station.id" placement="top-start">{{station.id}}</el-tooltip>
          </div>
          <div
            class="agv-spot"
            v-bind:style="agvc_style(agv_name)"
            v-for="agv_name in agvc_names"
            :key="agv_name"
          >
            <div class="agv-icon" v-bind:class="agvc_navigate_state(agv_name)">
              <i class="px-2 py-2 bi bi-car-front"></i>
            </div>
            <el-tooltip placement="top-start" :content="agvc_navigate_description(agv_name)">
              <div class="agv-name">{{agv_name}}</div>
            </el-tooltip>
          </div>
        </div>
        <div class="map-header d-flex flex-row px-2 pt-1">
          <div class="station-type-ledgend d-flex flex-row px-2 pt-1">
            <span>STATION:</span>
            <div class="LocationMark mx-2"></div>一般站點 |
            <div class="CharginMark mx-2"></div>充電站
            <span class="agv-label">AGVC:</span>
            <div class="non-navigating mx-2"></div>IDLE |
            <div class="navigating mx-2"></div>執行導航
          </div>
          <div class="map-view-control d-flex flex-row px-2 pt-1">
            <el-tooltip content="順時針旋轉90" placement="top-end">
              <i class="bi bi-arrow-clockwise" @click="ClockwisingMap"></i>
            </el-tooltip>
            <span>|</span>

            <el-tooltip content="逆時針旋轉90" placement="top-end">
              <i class="bi bi-arrow-counterclockwise" @click="CounterClockwisingMap"></i>
            </el-tooltip>
          </div>
        </div>
      </div>
      <div class="station-list pt-2">
        <div
          class="station-item text-start px-2"
          v-for="station in map_info.stations"
          :key="station.id"
        >
          <el-tooltip class="mx-5" :content="`(${station.x},${station.y})`" placement="left">
            <i class="bi bi-geo-alt w-100">
              <span class="px-2">{{station.id}}</span>
            </i>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { HostUrl } from '@/assets/APIHelper/backend';
export default {

  props: {
    map_info: {
      type: Object,
      default: {
        name: "",
        stations: [
          // {
          //   id: "LM1",
          //   desc: "",
          //   type: "LocationMark",
          //   x: 2.277,
          //   y: -0.065,
          //   r: -3.1416
          // }
        ],
        mapFileUrl: ""
      }
    },
  },
  watch: {
    map_info: {
      handler: function (newval, oldval) {
        console.info(newval, oldval);
        this.wsClose();
        this.agvc_location = {};
        this.wsIni();
      },
      deep: true,
    }
  },
  data() {
    return {
      map_props: {
        width: 1200,
        height: 800
      },
      map_zoom_ratio: 120,
      grid_ary: [],
      ws: null,
      agvc_location: {
        //globalCoordinate
        //navigationState

      },
      station_block_size: {
        width: 60,
        height: 40
      },
      agv_spot_size: {
        width: 20,
        height: 20
      }
    }
  },
  methods: {
    wsIni() {
      var wsHost = HostUrl.replace("http", "ws");
      var ws = new WebSocket(wsHost + `/map_agvc?mapName=${this.map_info.name}`);
      ws.onopen = () => console.info('ws connected');
      ws.onmessage = (event) => this.WsMsgHandle(JSON.parse(event.data));
      this.ws = ws;
    },
    wsClose() {
      if (this.ws) {
        this.ws.close();
      }
    },
    WsMsgHandle(data) {
      Object.keys(data).forEach(key => {
        if (this.agvc_location[key] == undefined) {
          this.agvc_location[key] = data[key].MapStates
        }
        this.agvc_location[key] = data[key].MapStates

      })
    },
    station_style(station_id) {
      var station = this.map_info.stations.find(st => st.id == station_id);
      var x = station.x;
      var y = station.y;
      var deg = 0.0;
      var radian = Math.PI / 180.0 * deg;
      //順時
      var xr = x * Math.cos(radian) + y * Math.sin(radian)
      var yr = y * Math.cos(radian) - x * Math.sin(radian)

      if (station) {
        return {
          top: this.map_props.height / 2 + (yr * this.map_zoom_ratio * -1) - (this.station_block_size.height / 2) + "px",
          left: this.map_props.width / 2 + (xr * this.map_zoom_ratio) - (this.station_block_size.width / 2) + "px",
          width: this.station_block_size.width + 'px',
          height: this.station_block_size.height + 'px'
        }
      }
      else
        return {}
    },
    agvc_style(agvc_name) {
      var locInfo = this.agvc_location[agvc_name].globalCoordinate;
      return {
        top: this.map_props.height / 2 + (locInfo.y * this.map_zoom_ratio * -1) - (this.agv_spot_size.height / 2) + "px",
        left: this.map_props.width / 2 + (locInfo.x * this.map_zoom_ratio) - (this.agv_spot_size.height / 2) + "px",
        width: this.agv_spot_size.width + 'px',
        height: this.agv_spot_size.height + 'px'
      }
    },
    agvc_navigate_state(agvc_name) {
      var navigationState = this.agvc_location[agvc_name].navigationState;
      return navigationState.IsNavigating ? "navigating" : "non-navigating";
    },
    agvc_navigate_description(agvc_name) {
      var navigationState = this.agvc_location[agvc_name].navigationState;
      if (navigationState.IsNavigating) {

        var paths = navigationState.pathStations == null ? "??" : navigationState.pathStations.join("->");
        return `目標站點:${navigationState.targetStationID}| 路徑:${paths}`;
      } else {

        return this.agvc_location[agvc_name].currentStationID;
      }

    },
    /**MAP 順時針旋轉90度 */
    ClockwisingMap() {

    },
    /**MAP 逆時針旋轉90度 */
    CounterClockwisingMap() {

    }
  },
  computed: {
    map_image_style() {
      return {
        backgroundImage: `url('${this.map_info.mapFileUrl}')`
      }
    },
    map_style() {
      return {
        width: this.map_props.width + "px",
        height: this.map_props.height + "px"
      }
    },
    map_width() {
      console.info(this.$refs.map.style);
      return this.$refs.map.style['width'];
    },
    center() {
      return { top: this.map_props.height / 2 + 'px', right: this.map_props.width / 2 + 'px' }
    },
    agvc_names() {
      return Object.keys(this.agvc_location);
    }
  },
  mounted() {
    for (let index = 0; index < 300; index++) {
      this.grid_ary.push(index);
    }
  }
}
</script>

<style scoped lang="scss">
$locationmarkcolor: rgb(9, 121, 74);
$charginmarkcolor: rgb(207, 80, 29);

$agvc-name-color: rgb(255, 255, 255);
$agvc-name-bg-color: rgb(207, 94, 94);
$agvc-navigating-color: rgb(255, 17, 0);
$agvc-non-navigating-color: rgb(122, 206, 122);

$map_img_scale: 6;

.map-comp {
  .header {
    background-color: rgb(48, 48, 48);
    color: white;
    z-index: 12;
  }
  .station-list {
    width: 150px;
    background-color: rgb(78, 78, 78);
    color: white;
    .station-item:hover {
      background-color: orangered;
      color: white;
      cursor: pointer;
    }
  }
  .map-base {
    position: absolute;
    top: 120px;
    left: 420px;
    display: grid;
    grid-template-columns: auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto;
    background-color: rgb(205, 205, 205);
    .map-image {
      top: 258px;
      left: 357px;
      position: absolute;
      width: 383px;
      height: 383px;
      //background-image: url("http://127.0.0.1:7122/map/map1.png");
      background-repeat: no-repeat;
      background-size: cover;
      -webkit-transform: scale($map_img_scale);
      -moz-transform: scale($map_img_scale);
      -o-transform: scale($map_img_scale);
      -ms-transform: scale($map_img_scale);
      transform: rotateZ(0) scale($map_img_scale);
      clip: rect(120px, 280px, 250px, 120px);
      // transform: rotateZ(-90deg);
    }
    .grid-item {
      background-color: rgb(205, 205, 205);
      //background-color: rgba(255, 255, 255, 0.8);
      border: 1px solid rgba(235, 235, 235, 0.8);
      padding: 3px;
      font-size: 12px;
      text-align: center;
    }
    .station-spot,
    .agv-spot {
      position: absolute;
      padding: 10px;
      background-color: rgb(65, 75, 75);
      color: white;
    }
    .station-spot {
      border: 1px solid black;
      box-shadow: 3px 2px 6px 0.1rem grey;
      // border-radius: 10px;
    }
    .agv-spot {
      background-color: transparent;
      .agv-icon {
        position: absolute;
        right: -8px;
        top: -2px;
        border-radius: 30px;
      }
      .agv-name {
        position: absolute;
        right: -23px;
        top: -32px;
        font-weight: bold;
        font-size: 9px;
        color: $agvc-name-color;
        background-color: $agvc-name-bg-color;
        padding: 5px;
      }
    }
    .navigating {
      background-color: $agvc-navigating-color;
    }
    .non-navigating {
      background-color: $agvc-non-navigating-color;
    }

    .center {
      color: red;
      background-color: transparent;
      border: none;
      box-shadow: none;
    }
    .LocationMark {
      background-color: $locationmarkcolor;
    }
    .CharginMark {
      background-color: $charginmarkcolor;
    }
  }
  .map-header {
    background-color: rgb(77, 77, 77);
    color: white;
    .station-type-ledgend {
      width: 100%;
      height: 30px;
      .agv-label {
        margin-left: 40px;
      }
      .LocationMark,
      .CharginMark,
      .navigating,
      .non-navigating {
        width: 25px;
        height: 15px;
        margin-top: 4px;
      }
      .LocationMark {
        background-color: $locationmarkcolor;
      }
      .CharginMark {
        background-color: $charginmarkcolor;
      }

      .navigating {
        background-color: $agvc-navigating-color;
      }
      .non-navigating {
        background-color: $agvc-non-navigating-color;
      }
    }
    .map-view-control {
      i {
        cursor: pointer;
      }
      span {
        margin: auto 10px;
      }
    }
  }
}
</style>