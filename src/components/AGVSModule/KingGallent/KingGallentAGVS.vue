<template>
  <div>
    <h1>KingGallent</h1>
    {{count}}
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0
    }
  },
  mounted() {
    setInterval(() => {
      this.count++;
    }, 1000);
  }
}
</script>

<style>
</style>