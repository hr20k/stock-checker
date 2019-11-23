<template>
  <div class="home">
    <el-container>
      <el-header>
        <div class="header">
          <h1 class="rogo">ストックチェッカー</h1>
          <div class="header-right">
            <el-button class="logout-button" @click="logout">ログアウト</el-button>
          </div>
        </div>
      </el-header>
      <el-main class="main">
        <el-row>
          <el-col :span="20" :offset="2">
            <div class="grid">
              <div class="item" v-for="(item, index) in items" :key="index">
                <div class="item-content" @click="selectItem(item)">
                  <el-card class="box-card" @click="setected = item">
                    <div class="image-slot">
                      <el-image class="image" :src="item.url" v-if="item.image_url" @load="itemLoaded" lazy>
                        <div slot="placeholder" class="image-slot">
                          Loading<span class="dot">...</span>
                        </div>
                        <div slot="error" class="image-slot">
                          <i class="el-icon-picture-outline"></i>
                        </div>
                      </el-image>
                    </div>
                    <p>{{ item.name }}</p>
                    <p>個数: {{ item.quantity }}個</p>
                    <div class="tags" v-if="item.tags">
                      <el-tag
                        :key="index"
                        v-for="(tag, index) in item.tags"
                        :disable-transitions="false"
                        type="info"
                        effect="plain"
                      >
                        {{tag.name}}
                      </el-tag>
                    </div>
                  </el-card>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    <el-button class="button fixed_btn" icon="el-icon-plus" @click="isOpen=true" circle></el-button>
    <AddItemModal :isOpen='isOpen' @event='close'/>
    <ItemDetailModal :isOpen='isOpenDetail' :selectedItem="selected" @event='close'/>
  </div>
</template>

<script>
import axios from 'axios'

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
      id: null,
      grid: null,
      isOpen: false,
      isOpenDetail: false,
      selected: null,
      items: []
    }
  },
  mounted () {
    this.id = JSON.parse(localStorage.getItem('x-sc-user')).id
    this.getItems().then(() => {
      this.grid = new Muuri(
        '.grid',
        { items: '.item' }
      )
    })
  },
  methods: {
    async getItems () {
      return axios.get(process.env.VUE_APP_API_BASE_URL + `users/${this.id}/items`, {
        headers: { 'x-sc-token': localStorage.getItem('x-sc-token') },
        data: {}
      }).then(res => {
        this.items = res.data.items
      })
    },
    itemLoaded () {
      // なんとかレイアウトし直したい。動かない。
      this.grid.layout()
    },
    selectItem (item) {
      this.selected = item
      this.isOpenDetail = true
    },
    selectedItemIndex () {
      return this.items.findIndex(item => item.id === this.selected.id)
    },
    logout () {
      localStorage.clear('x-sc-user')
      localStorage.clear('x-sc-token')
      this.$router.push('Login')
    },
    close (data) {
      this.isOpen = false
      this.isOpenDetail = false
      if (data && data.status === 'add') {
        this.items.push(data.item)
        // DOMが追加されないので仕方なくスリープ
        setTimeout(() => {
          const itemElement = Array.from(document.getElementsByClassName('item'))
          this.grid.add(itemElement.find(i => !i.classList.contains('muuri-item')))
        }, 500)
      } else if (data && data.status === 'update') {
        this.items[this.selectedItemIndex()] = data.item
      } else if (data && data.status === 'delete') {
        this.items.splice(this.selectedItemIndex(), 1)
        this.grid.remove(this.selectedItemIndex())
      }
    }
  }
}
</script>

<style lang="sass" scoped>
@import 'src/assets/style/style.sass'

.el-header
  padding: 0
  background-color: $primary
.header
  position: relative
  max-width: 1000px
  padding: 0 10px
  margin: auto
.rogo
  font-size: 20px
  position:absolute
  height: 30px
  padding: 15px 0
  margin: 0
  float: left
  color: $primary-text
  user-select: none
  -moz-user-select: none
  -webkit-user-select: none
  -ms-user-select: none
.logout-button
  color: $primary-text
  background-color: $primary
  border-color: $primary-text
.header-right
  float: right
  padding: 10px 0
.main
  height: calc(100vh - 60px)
  padding: 20px 0 20px 0

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

.image
  width: 100%
  text-align: center

.el-tag + .el-tag
  margin-left: 10px

.fixed_btn
  position: fixed
  bottom: 15px
  right: 15px
  width: 65px
  height: 65px
  background: $primary
  font-size: 120%
  color: $primary-text
  text-align: center
  vertical-align: middle
  overflow: hidden
  z-index: 4
</style>
