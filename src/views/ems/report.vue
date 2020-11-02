<template>
  <el-card class="form-container" shadow="never">
    <el-form    :model="value"  :rules="eventReportRules"   ref="eventReportForm" label-width="120px" style="width: 600px;" size="small">
        <h3 style="margin-top: -20px" align="center">事件上报</h3>
      <el-form-item label="事件名：" prop="subject">
        <el-input v-model="value.subject" clearable></el-input>
      </el-form-item>
      <el-form-item label="类别：" prop="type">
        <el-select v-model="value.type" placeholder="请选择事件类别">
          <el-option
            v-for="item in typeOptionList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="相关图片：" prop="pic">
        <multi-upload v-model="selectRoomPics"></multi-upload>
      </el-form-item>
      <el-form-item label="描述：" prop="description">
        <el-input
          :rows="4"
          :autoSize="true"
          v-model="value.description"
          type="textarea"
          placeholder="请输入描述" clearable></el-input>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button type="primary" size="medium" @click.prevent="handleCommit">确认</el-button>
        <el-button size="medium" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

  </el-card>
</template>

<script>
    import {report} from '@/api/event'
    import MultiUpload from '@/components/Upload/multiUpload'
    const validateSubject = (rule, value, callback) => {
        if (value===null||value.trim()==='') {
            callback(new Error('请输入事件名'))
        }else {
            callback();
        }
    };
    const validateType = (rule, value, callback) => {
        if (value===1||value===2) {
            callback()
        } else {
            callback(new Error('请选择事件类别') );
        }
    };
    export default {
        name: "reportEvent",
        components:{MultiUpload},
        data(){
            return{
                value:{
                    subject:null,
                    type:null,
                    description:null,
                    pic:null,
                },
                eventReportRules:{
                    subject: [{required: true, trigger: 'blur', validator: validateSubject}],
                    type: [{required: true, trigger: 'blur', validator: validateType}],
                },
                typeOptionList:[
                    {
                        label:"清洁",
                        value:1
                    },
                    {
                        label:"修理",
                        value:2
                    }
                ],

            }
        },

        computed:{
            //房间的图片
            selectRoomPics:{
                get:function () {
                    let pics=[];
                    if(this.value.pic===undefined||this.value.pic==null||this.value.pic===''){
                        return pics;
                    }
                    let pic = this.value.pic.split(',');
                    for(let i=0;i<pic.length;i++){
                        pics.push(pic[i]);
                    }
                    return pics;
                },
                set:function (newValue) {
                    if (newValue == null || newValue.length === 0) {
                        this.value.pic = null;
                    } else {
                        this.value.pic = '';
                        if (newValue.length > 0) {
                            for (let i = 0; i < newValue.length; i++) {
                                this.value.pic += newValue[i];
                                if (i !== newValue.length - 1) {
                                    this.value.pic += ',';
                                }
                            }
                        }
                    }
                }
            }
        },
        filters:{

        },
        methods:{
            handleCommit(){
                this.$refs.eventReportForm.validate(valid => {
                    if (valid) {
                        report(this.value).then(()=>{
                            this.$message({
                                message: '任务上报成功',
                                type: 'success',
                                duration: 1000
                            });
                            this.handleReset()
                        });
                    }else {
                        console.log('参数验证不合法！');
                    }
                });
            },
            handleReset(){
                this.value={
                    subject:null,
                        type:null,
                        description:null,
                        pic:null,
                };
            }
        },

    }
</script>

<style scoped>
  .form-container {
    position: absolute;
    left: 0;
    right: 0;
    width: 720px;
    padding: 35px 35px 15px 35px;
    margin: 10% auto;
  }
</style>
