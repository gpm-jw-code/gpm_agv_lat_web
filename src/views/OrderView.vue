<template>
  <div>
    <div class="d-flex flex-row h-100">
      <div
        class="table-container block-item"
        v-bind:class="show_task_data?'table-mini':'table-full'"
      >
        <div class="border-bottom w-100 mb-3">
          <h3>Order List</h3>
        </div>
        <el-table row-key="OrderNo" :data="OrderList" highlight-current-row>
          <el-table-column label="NO" prop="OrderNo" :width="60" fixed="left"></el-table-column>
          <el-table-column label="任務名" prop="latOrderDetail.taskName" :width="120" fixed="left"></el-table-column>
          <el-table-column label="訂單狀態" prop="State" :formatter="StateFormatter"></el-table-column>
          <el-table-column label="訂單需求廠商(派車)" prop="FromAGVS.agvsType">
            <template #default="scope">
              <el-tag
                v-if="scope.row.FromAGVS!=undefined"
                style="cursor:pointer"
                type="danger"
                size="normal"
                effect="plain"
              >{{ AGVSProviderFormatter(scope.row.FromAGVS.agvsType)}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="訂單接收時間" prop="RecieveTimeStamp" :formatter="TimeFormatter">
            <template #header>
              訂單接收時間
              <el-popover content="LAT平台接收到派車任務的時間戳" placement="top-start">
                <template #reference>
                  <i class="bi bi-question-circle"></i>
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="執行訂單的AGVC" prop="ExecuteingAGVC">
            <template #default="scope">
              <!-- {{ExecuteAGVCInfoFormatter(scope.row.ExecuteingAGVC)}} -->
              <div class="w-100">
                <el-tag
                  class="w-100"
                  style="cursor:pointer"
                  effect="plain"
                  @click="AgvcTagClickHandle(scope.row.ExecuteingAGVCInfo.agvcID)"
                >{{ExecuteAGVCInfoFormatter(scope.row.ExecuteingAGVCInfo)}}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="訂單完成時間" prop="CompleteTimeStamp" :formatter="TimeFormatter"></el-table-column>
          <el-table-column fixed="right">
            <template #default="scope">
              <el-button @click="ShowOrderBtnClickHandle(scope.row)">Order 內容</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- <transition name="el-zoom-in-top"> -->
      <div v-show="show_task_data" class="block-item h-100 task-data-view-container border-left">
        <div class="d-flex flex-row">
          <el-button circle @click="show_task_data=false">
            <i class="bi bi-chevron-double-right"></i>
          </el-button>
          <h3 class="mx-2">Task Data</h3>
        </div>
        <span class="title">LAT Format</span>
        <el-card style="height:400px;overflow-y:scroll">
          <template #header>
            <div class="card-header d-flex flex-row w-100">
              <span class="text-start flex-fill">Order-{{SelectOrderNO}}</span>
              <!-- <el-button round type="danger" size="small">1</el-button>
              <el-button round type="danger" size="small">2</el-button>-->
            </div>
          </template>
          <json-viewer
            class="text-start"
            :value="SelectedOrderTaskData_LAT"
            :expand-depth="4"
            copyable
            boxed
            expanded
          ></json-viewer>
        </el-card>

        <span class="title">From AGVS</span>
        <el-card style="height:400px;overflow-y:scroll">
          <template #header>
            <div class="card-header d-flex flex-row w-100">
              <span class="text-start flex-fill">Order-{{SelectOrderNO}}</span>
              <!-- <el-button round type="danger" size="small">1</el-button>
              <el-button round type="danger" size="small">2</el-button>-->
            </div>
          </template>
          <json-viewer
            class="text-start"
            :value="SelectedOrderTaskData"
            :expand-depth="4"
            copyable
            boxed
            expanded
          ></json-viewer>
        </el-card>
      </div>
      <!-- </transition> -->
    </div>
  </div>
</template>

<script>
import { GetOrderList } from '@/assets/APIHelper/backend.js'
import { GetAGVSTypeName, GetAGVCTypeName } from '@/assets/EnumsHelper';
import moment from 'moment';
export default {
  data() {
    return {
      OrderList: [
        {
          OrderNo: 1,
          TaskDownloadData: {
            "SID": '001:001:001',
            "EQName": 'AGV_001',
            "Header": {
              "0301": {
                "Time Stamp": "20220831 12:00:01",
                test: 12.33
              }
            }
          }
        },
        {
          OrderNo: 2,
          TaskDownloadData: {

          }
        }
      ],
      show_task_data: true,
      SelectOrderNO: -1,
      websocket: null
    }
  },
  methods: {
    ShowOrderBtnClickHandle(order) {
      if (!this.show_task_data)
        this.show_task_data = true;
      else
        this.show_task_data = this.SelectOrderNO != order.OrderNo;
      this.SelectOrderNO = order.OrderNo;
    },
    /**從後端拉當前訂單 */
    async FetchOrderList() {
      this.OrderList = await GetOrderList();
    },
    /** 訂閱訂單狀態變化*/
    SubscribeOrderChange() {
      this.websocket = new WebSocket('ws://localhost:5279/order');
      this.websocket.onmessage = (event) => {
        var newOrder = JSON.parse(event.data);
        var orderExist = this.OrderList.find(od => od.OrderNo == newOrder.OrderNo);
        if (orderExist) { //更新訂單內容
          this.UpdateOrder(newOrder);
        } else
          this.OrderList.push(newOrder);
      }
      this.websocket.onopen = () => console.info('[/order] ws connected');
    },
    UpdateOrder(newOrder) {
      var index = this.OrderList.findIndex(od => od.OrderNo == newOrder.OrderNo);
      this.OrderList[index] = newOrder;
    },
    TimeFormatter(row, colume, value, index) {
      return moment(value).format('yyyy-MM-DD HH:mm:ss');
    },
    AGVSProviderFormatter(value) {
      return GetAGVSTypeName(value);
    },
    StateFormatter(row, colume, value, index) {
      if (value == 0)
        return "等待訂單接收";
      else if (value == 1)
        return "訂單執行中";
      else if (value == 2)
        return "訂單已完成";
      else
        return "Unknown";
    },
    ExecuteAGVCInfoFormatter(ExecuteingAGVCInfo) {
      if (ExecuteingAGVCInfo == undefined)
        return "";
      return `${ExecuteingAGVCInfo.agvcID}(${GetAGVCTypeName(ExecuteingAGVCInfo.agvcType)})`;
    },
    AgvcTagClickHandle(agvcID) {
      this.$router.push({ name: 'agvc', query: { agv_id: agvcID } });

    }
  },
  computed: {
    SelectedOrderTaskData() {
      var order = this.OrderList.find(od => od.OrderNo == this.SelectOrderNO);
      if (order) {
        return order.TaskDownloadData;
      } else {
        return {};
      }
    },
    SelectedOrderTaskData_LAT() {
      var order = this.OrderList.find(od => od.OrderNo == this.SelectOrderNO);
      if (order) {
        return order.latOrderDetail;
      } else {
        return {};
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.FetchOrderList().then(() => {
        this.SubscribeOrderChange();
      });
    }, 10)
  }
}
</script>

<style lang="scss">
.task-data-view-container {
  width: 30%;
}

.table-mini {
  width: 70%;
}

.table-full {
  width: 100%;
}

.task-data-view-container {
  .title {
    text-align: left;
    width: 100%;
    float: left;
    margin-top: 10px;
  }
}
</style>