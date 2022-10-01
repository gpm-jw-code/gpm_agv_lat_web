<template>
  <el-backtop :right="40" :bottom="40"></el-backtop>

  <nav class="navbar navbar-expand-sm navbar-dark bg-dark fixed-top">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">GPM</a>
      <button class="navbar-toggler" type="button" v-b-toggle.navbarID>
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarID">
        <div class="navbar-nav">
          <a class="nav-link active" aria-current="page" href="/">
            <i class="bi bi-house"></i> Home
          </a>
          <a class="nav-link active" aria-current="page" href="/Orders">
            <i class="bi bi-list-ol"></i> Orders
          </a>
          <a class="nav-link active" aria-current="page" href="/agvc">
            <i class="bi bi-car-front"></i> 車庫
          </a>
          <a class="nav-link active" aria-current="page" href="/map_view">
            <i class="bi bi-pin-map-fill"></i> MAP
          </a>
          <a class="nav-link active" aria-current="page" href="/log">
            <i class="bi bi-card-text"></i> Log
          </a>
          <a class="nav-link active" aria-current="page" href="/agvs">AGVS</a>
        </div>
      </div>
    </div>
  </nav>
  <router-view style="height:100%;padding-top: 30px;" v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

html,
body {
  height: 100%;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #ffffff;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
