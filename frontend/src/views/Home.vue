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
            <div class="filter-group">
              <p>絞り込み</p>
              <el-input class="filter-text" ref="search" placeholder="Search..." prefix-icon="el-icon-search" v-model="filterValue"></el-input>
              <el-select
                class="filter-color"
                v-model="filterColor"
                placeholder="All"
              >
                <el-option v-for="c in colors" :key="c.value" :label="c.label" :value="c.value">
                </el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20" :offset="2">
            <div class="grid">
              <div class="item" v-for="(item, index) in items" :key="index">
                <div class="item-content" @click="selectItem(item)">
                  <el-card class="box-card" @click="setected = item">
                    <div class="image-slot" v-if="item.image_url">
                      <el-image class="image" :src="item.url" @load="itemLoaded" fit="cover">
                        <div slot="placeholder" class="image-slot">
                          Loading<span class="dot">...</span>
                        </div>
                        <div slot="error" class="image-slot">
                          <i class="el-icon-picture-outline"></i>
                        </div>
                      </el-image>
                    </div>
                    <p class="name">{{ item.name }}</p>
                    <p>個数: {{ item.quantity }}個</p>
                    <p style="display: none">{{ item.notes }}</p>
                    <p class="color" style="display: none">{{ item.color }}</p>
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
      filterValue: '',
      filterColor: '',
      grid: null,
      isOpen: false,
      isOpenDetail: false,
      selected: null,
      items: [],
      colors: [
        { value: '', label: 'All' },
        { value: '#f44336', label: 'Red' },
        { value: '#e91e63', label: 'Pink' },
        { value: '#2196f3', label: 'Blue' },
        { value: '#00bcd4', label: 'Cyan' },
        { value: '#4caf50', label: 'Green' },
        { value: '#ffeb3b', label: 'Yellow' },
        { value: '#ff9800', label: 'Orange' },
        { value: '#795548', label: 'Brown' },
        { value: '#9e9e9e', label: 'Grey' }
      ]
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
    this.$refs.search.focus()
  },
  watch: {
    filterValue () {
      this.filter()
    },
    filterColor () {
      this.filter()
    }
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
      // なんとかレイアウトし直したい。とりあえずゴリ押し。
      this.grid.filter(item => false)
      this.grid.filter(item => true)
    },
    filter () {
      this.grid.filter((item) => {
        const itemName = item.getElement().getElementsByClassName('name').item(0).innerText.toLowerCase()
        const itemTags = Array.from(item.getElement().getElementsByClassName('tags').item(0).children).map(t => t.innerText.toLowerCase())
        const itemColor = item.getElement().getElementsByClassName('color').item(0).innerText
        const isSearchMatch = !this.filterValue ? true : itemName.includes(this.filterValue.toLowerCase())
        const isTagsMatch = !this.filterValue ? true : itemTags.find(tag => tag.includes(this.filterValue.toLowerCase()))
        const isColorMatch = !this.filterColor ? true : itemColor.includes(this.filterColor)
        return (isSearchMatch || isTagsMatch) && isColorMatch
      })
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

.filter-group
  overflow: hidden
  background-color: #e0e0e0
  border-radius: 4px
  margin: 5px
  max-width: 1000px
  margin: 0 auto 10px auto
.filter-group p
  margin: 5px 10px
  font-size: 15px
.filter-text
  float: left
  max-width: 320px
  margin: 5px
.el-select.filter-color
  float: left
  min-width: 160px
  margin: 5px

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

.el-card
  color: $primary-text
  padding: 0

.el-card p
  font-size: 15px
  margin: 10px 0 5px 0
.el-card p + p
  margin: 0 0 5px 0
.image-slot
  position: relative
  width: 100%

.image
  width: 100%
  height: auto
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
