<template>
  <nav class="navbar navbar-expand-sm navbar-dark bg-primary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">GPM</a>
      <button class="navbar-toggler" type="button" v-b-toggle.navbarID>
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarID">
        <div class="navbar-nav">
          <a class="nav-link active" aria-current="page" href="/">LAT</a>
          <a class="nav-link active" aria-current="page" href="/Orders">Orders</a>
        </div>
      </div>
    </div>
  </nav>
  <router-view style="height:100%" />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 90%;
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
