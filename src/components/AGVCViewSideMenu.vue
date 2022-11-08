<template>
  <div
    class="agvc-side-menu h-100"
    v-bind:class="isCollapse? 'hidding':''"
    v-loading.fullscreen.lock="full_screen_loading"
  >
    <div class="toggle" v-bind:class="isCollapse?'hidding':''">
      <span v-if="isCollapse" class="mx-3 py-2" @click="Show()">
        <i class="bi bi-list"></i>
      </span>
      <span v-else class="mx-3 py-2" @click="Hide()">
        <i class="bi bi-arrow-left"></i>
      </span>
    </div>
    <transition name="el-fade-in">
      <div class="sidebar h-100 my-2" v-show="!isCollapse">
        <div class="title text-start w-100 px-3 py-2">{{menu_title}}</div>
        <!-- ComboBox 模式 -->
        <div class="selector-mode" v-show="false">
          <el-select size="large" v-model="selectedAgvcID" @change="ChangeAGVC">
            <el-option
              v-for="agv in listData"
              :key="agv.Key"
              :label="`${agv.Key}(${agv.Value.EQName})`"
              :value="agv.Key"
            ></el-option>
          </el-select>
        </div>

        <!-- 側邊欄選單模式 -->
        <div class="menu-mode border-top h-100">
          <div class="d-flex flex-column">
            <div
              v-bind:class="agv.Key==selectedAgvcID?'active':'inactive' "
              class="item text-start w-100"
              v-for="agv in listData"
              :key="agv.Key"
              :index="agv.Value"
              @click="ChangeAGVC(agv.Key)"
            >
              <a
                class
                @click="ChangeAGVC(agv.Key)"
                v-bind:class="agv.Key==selectedAgvcID?'a-active':'a-inactive' "
              >
                <i v-if="!agv.Value.Connected" class="bi bi-exclamation-lg" style="color:red"></i>
                <i v-else class="bi bi-check" style="color:lime"></i>
                <i class="bi bi-car-front"></i>
                {{agv.Value.EQName}} | ({{agv.Value.Type}})
              </a>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    listData: {
      type: Array,
      default: []
    },
    menu_title: {
      type: String,
      default: "AGVC List"
    }
  },
  data() {
    return {
      isCollapse: false,
      position: 'left',
      selectedAgvcID: '',
      full_screen_loading: false
    }
  },
  methods: {
    Hide() {
      this.isCollapse = true;
      this.$emit('collapseChange', true);
    },
    Show() {
      this.isCollapse = false;
      this.$emit('collapseChange', false);
    },
    GetCollapseState() {
      return this.isCollapse;
    },
    ChangeAGVC(selected_id) {
      this.full_screen_loading = true;
      this.selectedAgvcID = selected_id;
      this.$router.push({ name: 'agvc', query: { agv_id: selected_id } });
      setTimeout(() => {
        this.full_screen_loading = false;
      }, 400);
    },
  },
  mounted() {
    if (this.$route.query.agv_id) {
      this.selectedAgvcID = this.$route.query.agv_id;
    } else {
      if (this.listData.length != 0) {
        this.selectedAgvcID = this.listData[0].Key;
      }
    }
  }
}
</script>

<style lang="scss">
:root {
  --bkcolor: rgb(53, 59, 65);
}
.agvc-side-menu {
  position: fixed;
  top: 56px;
  width: 250px;
  height: 120%;
  z-index: 3010;
  border-right: 1px solid rgb(211, 211, 211);
  box-shadow: 1px 10px 8px 2px rgb(145, 145, 145);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  .toggle {
    text-align: right;
    position: relative;
    right: -20px;
    top: 0.3rem;
    cursor: pointer;
    font-size: 20px;
    z-index: 1;
    color: white;
    :hover {
      background-color: grey;
      color: white;
    }
    span {
      padding: 20px;
    }
  }
  .hidding {
    text-align: left;
    left: -20px;
    color: black;
  }
  .sidebar {
    background-color: var(--bkcolor);
    padding: 8px;
    .title {
      position: absolute;
      top: 0px;
      left: 0;
      z-index: 0;
      background-color: var(--bkcolor);
      color: white;
      font-weight: bold;
      letter-spacing: 1px;
    }
    .menu-mode {
      .item {
        cursor: pointer;
        padding: 3px 22px;
        margin: 8px auto;
        a {
          font-size: 16px;
          text-decoration: none;
          width: 100%;
        }
        .a-active {
          color: rgb(32, 160, 255);
        }
        .a-inactive {
          color: rgb(218, 218, 218);
        }
      }
      .item:hover {
        background-color: rgba(219, 219, 219, 0.384);
      }
      .active {
        border-bottom: 1px solid rgb(95, 95, 95);
      }
    }
  }
}
.hidding {
  border-right: none;
  box-shadow: none;
}
</style>