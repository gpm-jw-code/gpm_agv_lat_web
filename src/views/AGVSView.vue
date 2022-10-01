<template>
  <div class="agvs-view">
    <!-- <div class="dispatcher">
      <agvc-dispatcher></agvc-dispatcher>
    </div>-->
    <div class="nav border-bottom mb-2 px-3">
      <router-link
        v-for="link in links"
        :key="link.name"
        :to="{name:link.name}"
        v-bind:class="active_name==link.name?'active':'inactive'"
        @click="active_name=link.name"
      >
        {{link.label}}
        <span class="mx-1">|</span>
      </router-link>
    </div>

    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script>
import AGVCDispatcherVue from '@/components/AGVSModule/AGVCDispatcher.vue';
export default {
  components: {
    'agvc-dispatcher': AGVCDispatcherVue,
  },
  data() {
    return {
      active_name: "agvs.kinggallent",
      links: [
        {
          name: 'agvs.kinggallent',
          label: 'KingGallent'
        }, {
          name: 'agvs.gpm',
          label: 'GPM'
        }
      ]
    }
  },
}
</script>

<style lang="scss" scoped>
.agvs-view {
  margin-top: 40px;
  .nav {
    font-size: 20px;
    .active {
      color: rgb(73, 143, 223);
      font-size: larger;
      font-weight: bold;
    }
    .inactive {
      padding-top: 5px;
    }
    span,
    a {
      color: black;
    }
    span {
      font-size: 18px;
    }
    a {
      text-decoration: none;
      margin: 5px;
    }
  }
  .dispatcher {
    width: 400px;
  }
}
</style>