<template>
  <div class="agvs-dispatcher">
    <el-form label-width="100px">
      <el-form-item label="派車系統">
        <el-select v-model="selectedAgvsType" placeholder="選擇派車">
          <el-option v-for="agvs in agvsTypes" :key="agvs" :value="agvs"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="EQ Name">
        <!-- <el-input v-model="EQName"></el-input> -->
        <el-select v-model="EQName" placeholder="選擇AGV">
          <el-option v-for="agvc in agvc_eq_names" :key="agvc" :value="agvc"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="SSID">
        <el-input v-model="SID"></el-input>
      </el-form-item>-->
      <el-form-item label="目標站點">
        <div class="d-flex flex-row">
          <el-select v-model="first_station" placeholder="選擇站點">
            <el-option v-for="station in stations" :key="station" :value="station"></el-option>
          </el-select>
          <el-button @click="AddStation">Add</el-button>
        </div>
        <div v-for="station in addtions_stations" :key="station.index">
          <div class="d-flex flex-row">
            <el-select v-model="station.name" placeholder="選擇站點">
              <el-option v-for="station in stations" :key="station" :value="station"></el-option>
            </el-select>

            <el-button plain type="danger" @click="DeleteStation(station.index)">Delete</el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="循環">
        <el-checkbox label></el-checkbox>
      </el-form-item>
    </el-form>
    <el-divider></el-divider>
    <b-button class="bg-primary w-100 mx-1" @click="Submit">Submit</b-button>
  </div>
</template>

<script>
import axios from 'axios';
import { CreateOrderTaskLink } from '@/assets/APIHelper/kingGallentEmu'

export default {
  props: {
    Default_AGV_Name: {
      type: String,
      default: "AGV_002"
    },
    agvc_eq_names: {
      type: Array,
      default() {
        return []
      }
    },
    stations: {
      type: Array,
      default() {
        return []
      }
    }
  },
  watch: {
    Default_AGV_Name: {
      handler: function (newName, oldName) {
        this.EQName = newName;
      },
      immediate: true
    }
  },
  data() {
    return {
      selectedAgvsType: "KingGallent",
      selectedAgvcName: "",
      EQName: "AGV_002",
      SID: "001:001:001",
      agvsTypes: [
        "KingGallent",
        "GPM"
      ],
      first_station: "LM1",
      addtions_stations: []
    }
  },
  methods: {
    AddStation() {
      var index = this.addtions_stations.length;
      this.addtions_stations.push({
        index: index,
        name: ''
      })
    },
    DeleteStation(station_index) {
      var index = this.addtions_stations.findIndex(s => s.index == station_index);
      this.addtions_stations.splice(index, 1);
    },
    async Submit() {
      this.RemoveBlankStations();
      var stations = [];
      stations.push(this.first_station);
      this.addtions_stations.forEach(station => {
        stations.push(station.name);
      });
      var data = {
        TaskID: "web-dispatch-" + Date.now(),
        Stations: stations
      }
      console.info(data);
      var ret = await CreateOrderTaskLink(this.SID, this.EQName, data).catch(er => {
        this.$notify({
          title: 'AGVS 派車',
          message: '發生錯誤:' + er.message,
          type: 'error',
          duration: '3500',
          position: 'top-right',
          showClose: 'true',
        });
      })

      if (ret.status == 200) {
        var response = ret.data;
        var state = response.State;
        var success = response.Success;
        var errMsg = response.ErrorMessage;

        this.$notify({
          title: 'AGVS 派車',
          message: success ? `派車成功-任務將${state == 0 ? '馬上執行' : '在稍後進行執行'}` : errMsg,
          type: success ? 'info' : 'error',
          duration: '2500',
          position: 'top-right',
          showClose: 'true',
        });

      } else {
        this.$notify({
          title: 'AGVS 派車',
          message: '發生錯誤',
          type: 'error',
          duration: '2500',
          position: 'top-right',
          showClose: 'true',
        });
      }
    },
    RemoveBlankStations() {
      var blankStationExist = true;
      while (blankStationExist) {
        var station = this.addtions_stations.find(s => s.name == '');
        blankStationExist = station != undefined;
        if (blankStationExist)
          this.DeleteStation(station.index);
      }

    }
  }
}
</script>

<style lang="scss" scoped>
</style>