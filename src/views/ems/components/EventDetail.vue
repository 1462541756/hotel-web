<template>
  <el-card class="form-container" shadow="never">
    <el-form v-if="option==='detail'"  :model="value" :rules="rules" ref="eventForm" label-width="120px" style="width: 600px" size="small">
      <h3 style="margin-top: -20px" align="center">事件详情</h3>
      <el-form-item  label="事件名：" prop="subject">{{value.subject}}</el-form-item>
      <el-form-item  label="类别：" prop="type">
        <el-select :disabled="true"   v-model="value.type" placeholder="请选择事件类别">
          <el-option
            v-for="item in typeOptionList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item  prop="pic">
        <img style="height: 80px;overflow: hidden"  v-for="img in pics" :src="img" alt="图片">
      </el-form-item>

      <el-form-item  label="描述：" prop="description">
        <el-input
          :disabled="true"
          :rows="4"
          :autoSize="true"
          v-model="value.description"
          type="textarea"
          placeholder="请输入内容" clearable></el-input>
      </el-form-item>

      <el-form-item  label="创建人：" prop="subject">{{value.reportPeople}}</el-form-item>
      <el-form-item label="创建时间：" prop="subject">{{value.createTime|formatDateTime}}</el-form-item>
      <el-form-item label="审核状态：" prop="subject">{{value.checkStatus|formatCheckStatus}}</el-form-item>
      <el-form-item label="审核人：" prop="subject">{{value.checkPeople}}</el-form-item>
      <el-form-item label="审核时间：" prop="subject">{{value.checkTime|formatDateTime}}</el-form-item>
      <el-form-item label="事件状态：" prop="subject">{{value.status|formatStatus}}</el-form-item>
      <el-form-item label="事件处理人：" prop="subject">{{value.handlePeople}}</el-form-item>
      <el-form-item label="事件处理时间：" prop="subject">{{value.receiveTime|formatDateTime}}</el-form-item>
      <el-form-item label="任务完成时间：" prop="subject">{{value.finishTime|formatDateTime}}</el-form-item>
      <el-form-item >
        <p>
          <el-button
            v-if="(value.checkStatus===0||value.checkStatus===2) && value.reportPeople===user&&hashAuthority('/event/reportFromDraft')"
            class="operate"
            size="mini"
            type="primary"
            @click="handleReportEvent">上报事件
          </el-button>
          <el-button
            v-if="value.checkStatus===1 && value.reportPeople===user&&hashAuthority('/event/reportFromDraft')"
            class="operate"
            size="mini"
            type="warning"
            @click="handleCancelEvent">取消上报
          </el-button>
          <el-button
            class="operate"
            v-if="value.checkStatus===1&&hashAuthority('/event/check')"
            size="mini"
            type="success"
            @click="handleCheckEvent">审核事件
          </el-button>
          <el-button
            v-if="hashAuthority('/event/changeStatus')&&value.checkStatus===3&&value.status===0"
            class="operate"
            size="mini"
            type="primary"
            @click="handleEvent(1)">接受任务
          </el-button>
          <el-button
            v-if="hashAuthority('/event/changeStatus')&&value.checkStatus===3&&value.status===1"
            class="operate"
            size="mini"
            type="primary"
            @click="handleEvent(2)">提交任务
          </el-button>
          <el-button
            v-if="hashAuthority('/event/changeStatus')&&value.checkStatus===3&&value.status===1"
            class="operate"
            size="mini"
            type="warning"
            @click="handleEvent(0)">放弃任务
          </el-button>
        </p>
      </el-form-item>
    </el-form>

    <el-form v-else  :model="value" :rules="rules" ref="eventForm" label-width="120px" style="width: 600px" size="small">
      <h3 style="margin-top: -20px" align="center">修改事件</h3>
      <el-form-item  label="事件名：" prop="subject">
        <el-input  v-model="value.subject" clearable></el-input>
      </el-form-item>
      <el-form-item  label="类别：" prop="type">
        <el-select  v-model="value.type" placeholder="请选择事件类别">
          <el-option
            v-for="item in typeOptionList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item  label="相关图片：" prop="pic">
        <multi-upload  v-model="selectRoomPics"></multi-upload>
      </el-form-item>

      <el-form-item  label="描述：" prop="description">
        <el-input
          :rows="4"
          :autoSize="true"
          v-model="value.description"
          type="textarea"
          placeholder="请输入描述" clearable></el-input>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button type="primary" size="medium" @click.prevent="handleCommit">保存</el-button>
        <el-button v-if="value.checkStatus===0" type="primary" size="medium" @click.prevent="handleReportEvent">上报</el-button>
        <el-button size="medium" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-dialog
      title="审核"
      :visible.sync="commit"
      width="30%">
      <el-input
        :rows="4"
        :autoSize="true"
        v-model="checkOpinion"
        type="textarea"
        placeholder="请输入审核意见" clearable></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleCommitConfirm(3)" size="small">通过</el-button>
        <el-button type="primary" @click="handleCommitConfirm(2)" size="small">不通过</el-button>
        <el-button @click="commit = false" size="small">取 消</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
    import {
        getEventById,
        reportFromDraft,
        report,
        cancelReportById,
        check,
        changeStatus,
    } from '@/api/event';
    import {getLoginInfo} from '@/api/admin';
    import MultiUpload from '@/components/Upload/multiUpload';
    import {
        formatDate as formatDate1
    }from '@/utils/date';
    export default {
        name: "EventDetail",
        props: {
            option: {
                type: String,
                default: "detail"
            }
        },
        components:{MultiUpload},
        data(){
            return{
                value:{
                },
                rules:{},
                userInfo:{
                    resources:[]
                },
                user:null,
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
                pics:[],
                commit:false,
                checkOpinion:null,
            }
        },
        created() {
            this.getUserInfo();
            if (this.$route.query.id!==null){
                this.getEvent();
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
            formatDateTime(time) {
                let date = new Date(time);
                return formatDate1(date, 'yyyy-MM-dd hh:mm:ss')
            },
            formatStatus(status){

                if (status===1){
                    return "处理中"
                }else if (status===2){
                    return "处理完成"
                }else if (status===0){
                    return "待处理"
                }else{
                    return  ""
                }
            },
            formatCheckStatus(status){
                if (status===1){
                    return "待审核"
                }else if (status===2){
                    return "审核不通过"
                }else if (status===3){
                    return "审核通过"
                }else  {
                    return  "未提交"
                }
            },
        },
        methods:{
            hashAuthority(url){

                let resources=  this.userInfo.resources;
                for (let i = 0; i < resources.length; i++) {
                    let item=resources[i].url;
                    if ("/event/**"===item||url===item||(url+"/**")===item){
                        return true;
                    }
                }
                return false;
            },
            handleCommit(){
                this.$refs.eventForm.validate(valid => {
                    if (valid) {
                        let params=this.value;
                        report(params).then(()=>{
                            this.$message({
                                message: '修改成功',
                                type: 'success',
                                duration: 1000
                            });
                            this.$router.push({path:'/ems/event'})
                        });
                    }else {
                        console.log('参数验证不合法！');
                    }
                });
            },
            handleCommitConfirm(checkStatus){
                this.$confirm('是否要确认?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = this.value;
                    params.checkOpinion=this.checkOpinion;
                    params.checkStatus=checkStatus;
                    check(params).then(response => {
                        this.$message({
                            message: '操作成功！',
                            type: 'success'
                        });
                        this.commit = false;
                        this.$router.push({path:'/ems/event'})
                    })
                })
            },
            handleReportEvent(){
                reportFromDraft(this.value.id).then(response => {
                    this.$message({
                        message: '上报成功',
                        type: 'success',
                        duration: 1000
                    });
                    this.$router.push({path:'/ems/event'})
                });
            },
            handleCancelEvent(){
                cancelReportById(this.value.id).then(response => {
                    this.$message({
                        message: '取消上报成功',
                        type: 'success',
                        duration: 1000
                    });
                    this.$router.push({path:'/ems/event'})
                });
            },
            handleCheckEvent(){
                this.commit=true;
            },
            handleEvent(status){
                let params=this.value;
                params.status=status;
                changeStatus(params).then((response)=>{
                    this.$message({
                        message: '处理任务成功',
                        type: 'success',
                        duration: 1000
                    });
                    this.$router.push({path:'/ems/event'})
                })
            },
            handleReset(){
                this.getEvent()
            },
            getEvent(){
                getEventById(this.$route.query.id).then((response)=>{
                    this.value=response.data;
                    this.pics=this.value.pic.split(",");
                })
            },
            getUserInfo(){
                getLoginInfo().then((response)=>{
                    this.userInfo=response.data;
                    this.user=response.data.username;
                });
            },
        }
    }
</script>

<style scoped>
  .form-container {
    position: absolute;
    left: 0;
    right: 0;
    width: 720px;
    padding: 35px 35px 15px 35px;
    margin: 20px auto;
  }
</style>
