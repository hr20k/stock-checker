<template>
<el-dialog
  class="modal"
  ref="modal"
  title="アイテム編集"
  :width="width"
  :fullscreen="width === '100%'"
  :visible.sync="isOpenModal"
  :before-close="cancel"
>
  <el-form class="modal-form" ref="item" :rules="rules" :model="item" :label-position="width === '100%' ? 'top' : 'right'" label-width="auto">
    <el-form-item label="商品名" prop="name">
      <el-input v-model="item.name"></el-input>
    </el-form-item>
    <el-form-item prop="quantity">
      <el-input-number v-model="item.quantity" :min="0"></el-input-number>
    </el-form-item>
    <el-form-item label="画像">
      <div class="slider">
        <el-slider v-model="imageHeight" :min="150" :max="300"></el-slider>
      </div>
      <croppa
        v-model="croppa"
        :initial-image="initialImage"
        :width="250"
        :height="imageHeight"
        :quality="quality"
        :prevent-white-space="true"
        :show-loading="true"
        remove-button-color="#ff9800"
        loading-color="#ff9800"
        initial-size="contain"
        placeholder="画像の追加"
        :placeholder-font-size="10"
        :file-size-limit="4000 * 6000"
        accept=".jpg,.jpeg,.png"
        @file-size-exceed="$message.error('ファイルサイズが大きすぎます')"
      >
      </croppa>
      <span v-if="message">{{ message }}</span>
    </el-form-item>
    <el-form-item>
      <el-button class="" @click="croppa.rotate()">回転</el-button>
    </el-form-item>
    <el-form-item label="メモ" prop="notes">
      <el-input
        type="textarea"
        :autosize="{ minRows: 3, maxRows: 6}"
        placeholder=""
        v-model="item.notes">
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-tag
        :key="tag"
        v-for="tag in tags"
        closable
        :disable-transitions="false"
        @close="handleClose(tag)"
        type="info"
        effect="plain"
      >
        {{tag}}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="tagVisible"
        v-model="tagValue"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
      >
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput">タグの追加</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="cancel()">キャンセル</el-button>
      <el-button @click="deleteItem()">削除</el-button>
      <el-button type="primary" @click="submitForm('item')">OK</el-button>
    </el-form-item>
  </el-form>
</el-dialog>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ItemDetailModal',
  props: ['isOpen', 'selectedItem'],
  data () {
    return {
      id: null,
      item: {
        name: '',
        quantity: 0,
        color: '',
        image_url: '',
        notes: ''
      },
      initialImage: null,
      quality: 2,
      allTags: [],
      tags: [],
      tagVisible: false,
      tagValue: '',
      croppa: {},
      width: '',
      imageHeight: 150,
      message: '',
      rules: {
        name: [{ required: true, message: '商品の名前を入力して下さい', trigger: 'change' }]
      }
    }
  },
  mounted () {
    this.id = JSON.parse(localStorage.getItem('x-sc-user')).id
    window.addEventListener('resize', this.fullscreen)
    this.width = window.innerWidth < 700 ? '100%' : '70%'
    this.getTags()
  },
  watch: {
    selectedItem (item) {
      this.resetForm()
      if (item.image_url) {
        const image = new Image()
        image.setAttribute('crossorigin', 'anonymous')
        image.src = item.url
        this.initialImage = image

        image.onload = () => {
          this.imageHeight = image.height / this.quality
        }
      }
      this.tags = item.tags.map(tag => tag.name)
      Object.assign(this.item, item)
    }
  },
  computed: {
    isOpenModal () {
      return this.isOpen
    }
  },
  methods: {
    handleClose (tag) {
      this.tags.splice(this.tags.indexOf(tag), 1)
    },
    showInput () {
      this.tagVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm () {
      let tagValue = this.tagValue
      if (this.tags.includes(tagValue)) {
        this.$message.error('タグがすでに存在します')
      } else {
        if (tagValue && this.allTags.find(tag => tag.name === tagValue)) {
          this.tags.push(tagValue)
        } else if (tagValue) {
          axios.post(process.env.VUE_APP_API_BASE_URL + `users/${this.id}/tags`,
            { name: tagValue },
            { headers: { 'x-sc-token': localStorage.getItem('x-sc-token') } }
          ).then((res) => {
            this.getTags()
            this.tags.push(tagValue)
          })
        }
        this.inputVisible = false
        this.tagValue = ''
      }
    },
    getTags () {
      axios.get(process.env.VUE_APP_API_BASE_URL + `users/${this.id}/tags`, {
        headers: { 'x-sc-token': localStorage.getItem('x-sc-token') },
        data: {}
      }).then(res => {
        this.allTags = res.data.tags
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const newItem = {
            name: this.item.name,
            quantity: this.item.quantity,
            image_url: this.item.image_url,
            color: this.item.color,
            notes: this.item.notes
          }
          if (this.croppa.hasImage()) {
            axios.post(process.env.VUE_APP_API_BASE_URL + `images`,
              { data: this.croppa.generateDataUrl('image/jpeg') },
              { headers: { 'x-sc-token': localStorage.getItem('x-sc-token') } }
            ).then(res => {
              newItem.image_url = res.headers['location']
              axios.put(process.env.VUE_APP_API_BASE_URL + `users/${this.id}/items/${this.item.id}`,
                { item: newItem, tags: this.tags.map(tag => this.allTags.find(t => t.name === tag).id) },
                { headers: { 'x-sc-token': localStorage.getItem('x-sc-token') } }
              ).then((result) => {
                this.resetForm()
                axios.get(process.env.VUE_APP_API_BASE_URL + `users/${this.id}/items/${result.data.id}`, {
                  headers: { 'x-sc-token': localStorage.getItem('x-sc-token') },
                  data: {}
                }).then(item => {
                  this.$emit('event', { status: 'update', item: item.data })
                })
              })
            })
          } else {
            axios.put(process.env.VUE_APP_API_BASE_URL + `users/${this.id}/items/${this.item.id}`,
              { item: newItem, tags: this.tags.map(tag => this.allTags.find(t => t.name === tag).id) },
              { headers: { 'x-sc-token': localStorage.getItem('x-sc-token') } }
            ).then((result) => {
              this.resetForm()
              axios.get(process.env.VUE_APP_API_BASE_URL + `users/${this.id}/items/${result.data.id}`, {
                headers: { 'x-sc-token': localStorage.getItem('x-sc-token') },
                data: {}
              }).then(item => {
                this.$emit('event', { status: 'update', item: item.data })
              })
            })
          }
        } else {
          return false
        }
      })
    },
    deleteItem () {
      axios.delete(process.env.VUE_APP_API_BASE_URL + `users/${this.id}/items/${this.item.id}`,
        { headers: { 'x-sc-token': localStorage.getItem('x-sc-token') }, data: {} }
      ).then((result) => {
        this.resetForm()
        this.$emit('event', { status: 'delete', item: this.item })
      })
    },
    cancel () {
      this.$emit('event')
    },
    resetForm () {
      try {
        console.log('remove canvas.')
        this.croppa.remove()
      } catch {
        console.log('remove error.')
      }
      this.tagVisible = false
      this.tagValue = ''
      this.item = {
        name: '',
        quantity: 0,
        color: '',
        image_url: '',
        notes: ''
      }
    },
    fullscreen () {
      this.width = window.innerWidth < 700 ? '100%' : '70%'
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.fullscreen)
  }
}
</script>

<style lang="sass" scoped>
@import 'src/assets/style/style.sass'

.modal
  margin: 0 auto
.slider
  max-width: 250px
.croppa-container
  background-color: $background

.el-tag + .el-tag
  margin-left: 10px
.button-new-tag
  margin-left: 10px
  height: 32px
  line-height: 30px
  padding-top: 0
  padding-bottom: 0
.input-new-tag
  width: 90px
  margin-left: 10px
  vertical-align: bottom
</style>
