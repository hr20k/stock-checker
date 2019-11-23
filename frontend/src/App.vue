<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="sass">
@import 'src/assets/style/style.sass'

html
  width: 100%
  height: 100%
body
  margin: 0
  color: $primary-text
  background-color: $background
  box-sizing: border-box
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif
</style>
