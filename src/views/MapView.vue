<template>
  <div class="map-view mt-4 h-100 d-flex flex-row">
    <div class="menu pt-3">
      <div class="head w-100 mb-3 border-bottom">地圖列表</div>
      <div
        class="map-name"
        v-bind:class="selectedMapName==map.name?'selected':''"
        v-for="map in mapInfos"
        :key="map.name"
        @click="()=>selectedMapName=map.name"
      >
        <i class="bi bi-map">
          <span>{{map.name}}</span>
        </i>
      </div>
    </div>
    <div class="view flex-fill">
      <map-component :map_info="mapInfo"></map-component>
    </div>

    <agvc-dispatcher-side-drawer Default_AGV_Name="AGV_001" ref="agvc_dispatcher"></agvc-dispatcher-side-drawer>
    <div class="open-agvc-dispatchcer-button">
      <el-button size="large" circle @click="$refs.agvc_dispatcher.Show()">派</el-button>
    </div>
  </div>
</template>
<script>
import MapComponentVue from '@/components/Map/MapComponent.vue';
import { GetMapInfos } from '@/assets/APIHelper/backend';
import AGVCDispatcher_SideDrawerVue from '@/components/AGVSModule/AGVCDispatcher_SideDrawer.vue';
export default {
  components: {
    "map-component": MapComponentVue,
    "agvc-dispatcher-side-drawer": AGVCDispatcher_SideDrawerVue
  },
  data() {
    return {
      mapInfos: [],
      selectedMapName: ""
    }
  },
  computed: {
    mapInfo() {
      var dsf = [];
      return this.mapInfos.find(m => m.name == this.selectedMapName);
    }
  },
  mounted() {
    GetMapInfos().then(mapinfos => this.mapInfos = mapinfos)
  },
}
</script>

<style scoped lang="scss">
.open-agvc-dispatchcer-button {
  position: fixed;
  bottom: 90px;
  right: 40px;
  font-size: 40px;
}
.map-view {
  .menu {
    width: 270px;
    background-color: black;
    color: white;
    height: 100%;
    text-align: left;
    overflow-x: scroll;

    .head {
      font-size: 25px;
      padding-left: 10px;
    }
    .map-name {
      padding: 7px;
      i {
        span {
          padding-left: 10px;
        }
      }
    }

    .map-name:hover {
      background-color: white;
      color: black;
      cursor: pointer;
    }
    .selected {
      background-color: grey;
    }
  }
  .view {
    background-color: grey;
  }
}
</style>