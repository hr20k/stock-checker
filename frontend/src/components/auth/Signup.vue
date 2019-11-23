<template>
  <div class="signup">
    <el-container class="container">
      <el-main class="main">
        <el-row>
          <el-col :span="24">
            <h1>ストックチェッカー</h1>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-card class="box-card form-card">
              <div class="message">
                <span :model="message" v-if="message">{{ message }}</span>
              </div>
              <el-form label-height="10px" :model="form" :rules="rules" ref="form" @submit.native.prevent="onSubmit('form')">
                <el-form-item prop="username">
                  <el-input placeholder="ユーザ名" v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input placeholder="パスワード" v-model="form.password" show-password></el-input>
                </el-form-item>
                <el-form-item prop="passwordAgain">
                  <el-input placeholder="パスワードの再入力" v-model="form.passwordAgain" show-password></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button class="button" native-type="submit">新規登録</el-button>
                </el-form-item>
              </el-form>
              <el-button class="text-button" type="text" @click="$router.push('Login')">ログイン</el-button>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Signup',
  data () {
    const checkPassword = (rule, value, callback) => {
      if (value !== this.form.password) {
        return callback(new Error('パスワードが一致しません'))
      }
      callback()
    }
    return {
      form: {
        username: '',
        password: '',
        passwordAgain: ''
      },
      rules: {
        username: [
          { required: true, message: 'ユーザ名を入力して下さい', trigger: 'change' }
        ],
        password: [
          { required: true, message: 'パスワードを入力して下さい', trigger: 'change' },
          { min: 4, max: 20, message: 'パスワードは4文字以上20文字以下です', trigger: 'change' }
        ],
        passwordAgain: [
          { required: true, message: 'パスワードを入力して下さい', trigger: 'change' },
          { validator: checkPassword, trigger: 'change' }
        ]
      },
      message: ''
    }
  },
  methods: {
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios.post(process.env.VUE_APP_API_BASE_URL + 'signup', this.form)
            .then(res => {
              localStorage.setItem('x-sc-user', JSON.stringify(res.data['x-sc-user']))
              localStorage.setItem('x-sc-token', res.data['x-sc-token'])
              this.$router.push('Home')
            })
            .catch(err => {
              this.message = `${err.response.status}: ${err.response.data.errorMessage}`
            })
        } else {
          this.message = '正しく入力されていない項目があります。'
          return false
        }
      })
    }
  }
}
</script>

<style lang="sass" scoped>
@import 'src/assets/style/style.sass'

.container
  height: 100vh
  text-align: center
.main
  margin: auto
.message
  font-size: 0.8em
  color: #F56C6C
  margin-bottom: 20px
.form-card
  max-width: 500px
  margin: 0 auto
.button
  width: 100%
  background-color: $primary
.text-button
  padding: 0
</style>
