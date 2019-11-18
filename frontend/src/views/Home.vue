<template>
  <div class="home">
    <el-container>
      <el-header class="header">Header</el-header>
      <el-main class="main">
        <el-row>
          <el-col :span="20" :offset="2">
            <div class="grid">
              <div class="item">
                <div class="item-content">
                  <!-- Safe zone, enter your custom markup -->
                  This can be anything.
                  <!-- Safe zone ends -->
                </div>
              </div>
              <div class="item">
                <div class="item-content">
                  <el-card class="box-card">
                    <span>Card name</span>
                    <div v-for="o in [0, 1, 2, 3]" :key="o" class="text">
                      {{'List item ' + o }}
                    </div>
                  </el-card>
                </div>
              </div>
              <div class="item">
                <div class="item-content">
                  <el-card class="box-card">
                    <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="images">
                    <div style="padding: 14px;">
                      <span>Yummy hamburger</span>
                      <div class="bottom clearfix">
                        <time class="time">{{ currentDate }}</time>
                        <el-button type="text" class="button">Operating</el-button>
                      </div>
                    </div>
                  </el-card>
                </div>
              </div>
              <div class="item">
                <div class="item-content">
                  <div class="my-custom-content">
                    Yippee!!!
                  </div>
                </div>
              </div>
              <div class="item">
                <div class="item-content">
                  <div class="my-custom-content">
                    Yippee!!!!
                  </div>
                </div>
              </div>
              <div class="item">
                <div class="item-content">
                  <div class="my-custom-content">
                    Yippee!!!!!
                  </div>
                </div>
              </div>
              <div class="item">
                <div class="item-content">
                  <div class="my-custom-content">
                    Yippee!
                  </div>
                </div>
              </div>
            </div>
            <!-- <div class="grid-content bg-purple"></div> -->
          </el-col>
        </el-row>
      </el-main>
      <el-footer class="footer">Footer</el-footer>
    </el-container>
    <el-tooltip class="item" effect="dark" content="クリックしてアイテムを追加" placement="left">
      <button class="button fixed_btn" @click="isOpen=true"><span></span></button>
    </el-tooltip>
    <AddItemModal :isOpen='isOpen' @event='close'/>
    <ItemDetailModal :isOpen='isOpenDetail' :item="selected" @event='close'/>
  </div>
</template>

<script>
// @ is an alias to /src
import AddItemModal from '@/components/AddItemModal.vue'
import ItemDetailModal from '@/components/ItemDetailModal.vue'
import Muuri from 'muuri'

export default {
  name: 'Home',
  components: {
    AddItemModal,
    ItemDetailModal
  },
  data () {
    return {
      grid: null,
      isOpen: false
    }
  },
  mounted () {
    this.grid = new Muuri(
      '.grid',
      {
        dragEnabled: true
      }
    )
    const allItems = this.grid.getItems()
    console.log(allItems)
  },
  methods: {}
}
</script>

<style lang="sass" scoped>
@import 'src/assets/style/style.sass'

.header
  padding: 0
.main
  height: 100vh
  padding: 20px 0 20px 0
.footer
  padding: 0
.grid-content
  border-radius: 4px
  min-height: 36px

.grid
  position: relative
  width: 1000px
  max-width: 100%
  height: 100%
  margin: 0 auto
.item
  display: block
  position: absolute
  width: 240px
  margin: 5px
  z-index: 1
  color: $primary-text
.item.muuri-item-dragging
  z-index: 3
.item.muuri-item-releasing
  z-index: 2
.item.muuri-item-hidden
  z-index: 0
.item-content
  position: relative
  width: 100%
  height: 100%

// 999px * (24 / 20)
@media ( max-width: 1215px )
  .item
    width: calc(33.33% - 11px)
    // height: calc(33.33vw - 11px)
// 749px * (24 / 20)
@media ( max-width: 898.8px )
  .item
    width: calc(50% - 11px)
    // height: calc(50vw - 11px)
// 499px * (24 / 20)
@media ( max-width: 598.8px )
  .item
    width: calc(100% - 11px)
    // height: calc(100vw - 11px)

.fixed_btn
  position: fixed
  bottom: 15px
  right: 15px
  width: 75px
  height: 75px
  background: $primary
  border-radius: 50%
  text-align: center
  vertical-align: middle
  overflow: hidden
  transition: .4s
  z-index: 4
.fixed_btn span:before,
.fixed_btn span:after
  display: block
  content: ''
  position: absolute
  width: 30px
  height: 2px
  margin: 0 25px 0 14px
  background: $primary-text
.fixed_btn span:after
  transform: rotate(90deg)
</style>
