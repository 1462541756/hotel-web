<template>
  <div>
    <el-card class="login-form-layout">
      <el-form autoComplete="on"
               :model="loginForm"
               :rules="loginRules"
               ref="loginForm"
               label-position="right">
        <div style="text-align: center">
          <svg-icon icon-class="login-hotel" style="width: 56px;height: 56px;color: #409EFF"></svg-icon>
        </div>
        <h2 class="login-title color-main">旅店后台管理系统</h2>
        <el-form-item prop="username">
          <el-input name="username"
                    type="text"
                    v-model="loginForm.username"
                    autoComplete="on"
                    placeholder="请输入用户名">
          <span slot="prefix">
            <svg-icon icon-class="user" class="color-main"></svg-icon>
          </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="password"
                    :type="pwdType"
                    @keyup.enter.native="handleLogin"
                    v-model="loginForm.password"
                    autoComplete="on"
                    placeholder="请输入密码">
          <span slot="prefix">
            <svg-icon icon-class="password" class="color-main"></svg-icon>
          </span>
            <span slot="suffix" @click="showPwd">
            <svg-icon icon-class="eye" class="color-main"></svg-icon>
          </span>
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 60px;text-align: center">
          <el-button style="width: 45%" type="primary" :loading="loading" @click.native.prevent="handleLogin">
            登录
          </el-button>
          <el-button style="width: 45%" type="primary" @click.native.prevent="handleTry">
            注册
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <img :src="login_center_bg" class="login-center-layout">
    <el-dialog
      title="账号注册"
      :visible.sync="dialogVisible"
      :show-close="false"
      :center="true"
      width="30%">
      <div style="text-align: center">
          <el-form
                   :rules="registerRules"
                   ref="registerForm"
                   :model="registerForm"
                   label-width="20%"
                   size="medium">

            <el-form-item label="用户名：" prop="username">
              <el-input type="text"
                        class="register-form"
                        v-model="registerForm.username"
                        maxlength="12"
                        minlength="3"
                        placeholder="请输入用户名">
                <span slot="prefix"><svg-icon icon-class="user" class="color-main"></svg-icon></span>
              </el-input>
            </el-form-item>


            <el-form-item label="密码：" prop="password">
              <el-input :type="pwdType"
                        class="register-form"
                        v-model="registerForm.password"
                        maxlength="12"
                        minlength="3"
                        placeholder="请输入密码">
                 <span slot="prefix"><svg-icon icon-class="password" class="color-main"></svg-icon></span>
                 <span slot="suffix" @click="showPwd"><svg-icon icon-class="eye" class="color-main"></svg-icon></span>
              </el-input>
            </el-form-item>


            <el-form-item label="确认密码：" prop="check">
              <el-input
                        :type="checkType"
                        class="register-form"
                        v-model="registerForm.check"
                        maxlength="12"
                        minlength="3"
                        placeholder="请输入确认密码">
                <span slot="prefix"><svg-icon icon-class="password" class="color-main"></svg-icon></span>
                <span slot="suffix" @click="showCheck"><svg-icon icon-class="eye" class="color-main"></svg-icon></span>
              </el-input>
            </el-form-item>

            <el-form-item label="邮箱：" prop="mail">
              <el-input
                type="text"
                class="register-form"
                v-model="registerForm.mail"
                placeholder="请输入邮箱">
              </el-input>
            </el-form-item>


            <el-form-item label="验证码：" prop="verificationCode" >

                <el-input type="text"
                          class="register-form"
                          v-model="registerForm.verificationCode"
                          maxlength="6"
                          minlength="6"
                          style="width: 60%;float: left"
                          placeholder="请输入验证码">
                </el-input>
                <el-button :type=type style="float: right;width: 35%" :disabled="disabled" @click="handleSentVerificationCode">{{buttonWord}}</el-button>
            </el-form-item>

          </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" :loading="registerLoading" @click.native.prevent="handleRegister">立即注册</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
    import {getLoginInfo} from '@/api/admin';
  import {sentVerificationCode} from '@/api/mail';
  import {register as handleRegister} from '@/api/register';
  import {isvalidUsername,isValidateMail} from '@/utils/validate';
  import {setSupport,getSupport,setCookie,getCookie} from '@/utils/support';
  import login_center_bg from '@/assets/images/login_center_bg.png'

  export default {
    name: 'login',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!isvalidUsername(value)) {
          callback(new Error('请输入正确的用户名,长度在3-12之间'));
        } else {
          callback();
        }
      };
      const validatePass = (rule, value, callback) => {
        if (value.length < 3||value.length>12) {
          callback(new Error('请输入正确的密码，长度在3-12之间'))
        } else {
          callback()
        }
      };
        const validateRegisterPass = (rule, value, callback) => {
            if (value.length < 3||value.length>12) {
                callback(new Error('请输入正确的密码，长度在3-12之间'))
            } if (value!==this.registerForm.check){
                callback(new Error('两次输入不相同'))
            }else {
                callback()
            }
        };
        const validateCheck = (rule, value, callback) => {
            debugger
            if (value==='') {
                callback(new Error('请输入确认密码'))
            } else if (value!==this.registerForm.password){
                callback(new Error('两次输入不相同'))
            }else {
                callback();
            }
        };
        const validateMail = (rule, value, callback) => {
            if (!isValidateMail(value)) {
                callback(new Error('请输入正确的邮箱，如：xxx@qq.com'))
            } else {
                callback();
            }
        };
        const validateCode = (rule, value, callback) => {
            if (value==='') {
                callback(new Error('请输入验证码'))
            } else if (value.length!==6){
                callback(new Error('请输入长度为6的验证码'))
            }else {
                callback();
            }
        };
      return {
          registerLoading:false,
          type:"primary",
          time:0,
          timer:null,
         buttonWord:"发送邮件",
         disabled:false,
        loginForm: {
          username: '',
          password: '',
        },
        registerForm:{
           username: '',
           password: '',
           check:'',
           mail:'',
           verificationCode:''
        },

        loginRules: {
          username: [{required: true, trigger: 'blur', validator: validateUsername}],
          password: [{required: true, trigger: 'blur', validator: validatePass}]
        },
          registerRules: {
              username: [{required: true, trigger: 'blur', validator: validateUsername}],
              password: [{required: true, trigger: 'blur', validator: validateRegisterPass}],
              check: [{required: true, trigger: 'blur', validator: validateCheck}],
              mail: [{required: true, trigger: 'blur', validator: validateMail}],
              verificationCode: [{required: true, trigger: 'blur', validator: validateCode}],
          },
        loading: false,
        pwdType: 'password',
        checkType:'password',
        login_center_bg,
        dialogVisible:false,
        supportDialogVisible:false
      }
    },
    created() {
      this.loginForm.username = getCookie("username");
      this.loginForm.password = getCookie("password");
      if(this.loginForm.username === undefined||this.loginForm.username==null||this.loginForm.username===''){
        this.loginForm.username = 'admin';
      }
      if(this.loginForm.password === undefined||this.loginForm.password==null){
        this.loginForm.password = '';
      }
    },
    methods: {
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = '';
        } else {
          this.pwdType = 'password';
        }
      },
      showCheck() {
            if (this.checkType === 'password') {
                this.checkType = ''
            } else {
                this.checkType = 'password'
            }
      },
      handleRegister(){
           this.$refs.registerForm.validate(valid => {
               if (valid) {
                   this.registerLoading = true;
                   handleRegister(this.registerForm).then((response)=>{
                       let value=response.data;
                       this.$message({
                           message: "注册成功",
                           duration: 1000
                       });
                       this.registerLoading = false;
                       this.dialogVisible =false;
                       this.loginForm.username=this.registerForm.username;
                       this.loginForm.password=this.registerForm.password;
                   }).catch(()=>{
                       this.registerLoading = false;
                   })
               } else {
                   console.log('参数验证不合法！');
                   return false
               }
           });
        },

      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            this.$store.dispatch('Login', this.loginForm).then(() => {
              this.loading = false;
              setCookie("username",this.loginForm.username,15);
              setCookie("password",this.loginForm.password,15);
                getLoginInfo().then((response)=>{
                    let roles=response.data.roles;
                    if (roles.length===1&&roles[0].id===9){
                        this.$router.push({path: '/front/index'})
                    }else {
                        this.$router.push({path: '/'});
                    }
                })
            }).catch(() => {
              this.loading = false
            })
          } else {
            console.log('参数验证不合法！');
            return false
          }
        })
      },
      handleSentVerificationCode(){
          this.disabled=true;
          this.time=12;
          this.timer=setInterval(()=>{
              this.time--;
              if (this.time<=0){
                  this.disabled=false;
                  this.buttonWord="再次发送";
                  clearInterval(this.timer);
              }else {
                  this.buttonWord=this.time+"S后再次发送";
              }
          },1000);
          this.$message({
              message: '邮件已发送，请注意邮箱',
              type: 'success',
              duration: 1000
          });
          sentVerificationCode({mail:this.registerForm.mail}).then((response)=>{
                this.$message({
                    message: '邮件发送成功',
                    type: 'success',
                    duration: 1000
                });
            })
        },
      handleTry(){
        this.dialogVisible =true
      },
    }
  }
</script>

<style scoped>
  .login-form-layout {
    position: absolute;
    left: 0;
    right: 0;
    width: 360px;
    margin: 140px auto;
    border-top: 10px solid #409EFF;
  }

  .login-title {
    text-align: center;
  }

  .login-center-layout {
    background: #409EFF;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    margin-top: 200px;
  }
  .register-form{
    width: 100%
  }
</style>
