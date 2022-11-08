<template>
  <div class="home">
    <b-alert class="mt-3" v-model="backend_disconnect" variant="danger">與後端服務器連線發生異常!</b-alert>
    <AGVSSettingVue @backend_connected="HandleBackendConnectedState"></AGVSSettingVue>
    <AGVCTableVue :states="agvcStatus"></AGVCTableVue>
  </div>
</template>

<script>
// @ is an alias to /src

import AGVSSettingVue from '@/components/AGVSSetting.vue';
import AGVCTableVue from '@/components/AGVCTable.vue';
export default {
  name: 'HomeView',
  components: {
    AGVSSettingVue, AGVCTableVue
  },
  data() {
    return {
      backend_disconnect: false
    }
  },
  methods: {
    HandleBackendConnectedState(connected) {
      this.backend_disconnect = !connected
    }
  },
}
</script>
