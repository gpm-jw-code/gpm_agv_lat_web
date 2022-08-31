<template>
  <div class="home">
    <AGVSSettingVue></AGVSSettingVue>
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
    }
  }
}
</script>
