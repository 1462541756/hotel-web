<template>
  <el-card class="form-container" style="width: 80%"  shadow="never">
    <div class="un-handle-layout">
      <div class="layout-title">搜索</div>
      <div class="un-handle-content">
    <el-form  :model="key" label-width="120px" style="width: 90%;" size="small">
      <el-form-item>
        <div class="block">
          <span class="demonstration">订单号：</span>
          <el-input style="width: 500px"   v-model="orderSn" placeholder="请输入订单号"></el-input>
          <el-button style="margin-left: 50px" type="primary" size="medium" @click.prevent="search()">搜索</el-button>
        </div>
      </el-form-item>
    </el-form>
      </div>
    </div>


      <div class="layout-title">房间信息</div>
      <div class="table-layout">
        <el-row>
          <el-col :span="8" class="table-cell-title">订单号</el-col>
          <el-col :span="8" class="table-cell-title">支付状态</el-col>
          <el-col :span="8" class="table-cell-title">入住状态</el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="table-cell">{{value.orderSn}}</el-col>
          <el-col :span="8" class="table-cell">{{value.status|formatStatus}}</el-col>
          <el-col :span="8" class="table-cell">{{value.registerStatus|formatRegisterStatus}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="table-cell-title">房间名</el-col>
          <el-col :span="8" class="table-cell-title">楼层号</el-col>
          <el-col :span="8" class="table-cell-title">房间号</el-col>

        </el-row>
        <el-row>
          <el-col :span="8" class="table-cell">{{value.roomName}}</el-col>
          <el-col :span="8" class="table-cell">{{value.floor}}</el-col>
          <el-col :span="8" class="table-cell">{{value.serial}}</el-col>
        </el-row>
      </div>

    <div class="layout-title">登记信息（{{value.people==null?0:value.people.length}}人）</div>
    <div class="table-layout">
      <el-row  class="font-medium">
        <el-col :span="4" class="table-cell-title">姓名</el-col>
        <el-col :span="8" class="table-cell-title">身份证号</el-col>
        <el-col :span="6" class="table-cell-title">入住时间</el-col>
        <el-col :span="6" class="table-cell-title">退房时间</el-col>
      </el-row>
      <el-row  v-for="item in value.people" :key="item.cardId" >
        <el-col :span="4" class="table-cell">{{item.name}}</el-col>
        <el-col :span="8" class="table-cell">{{item.cardId}}</el-col>
        <el-col :span="6" class="table-cell">{{item.checkInTime | formatDateTime}}</el-col>
        <el-col :span="6" class="table-cell">{{item.checkOutTime | formatDateTime}}</el-col>
      </el-row>
      <el-row v-show="value==null||value.people==null||value.people.length===0">
      <el-col :span="4" class="table-cell"></el-col>
      <el-col :span="8" class="table-cell"></el-col>
      <el-col :span="6" class="table-cell"></el-col>
      <el-col :span="6" class="table-cell"></el-col>
      </el-row>
    </div>
    <div class="un-handle-content">
      <el-form v-if="value!=null&&value.status!=null&&value.status===1" :model="key"  ref="roomInfoForm"  style="text-align: center;margin: 0 auto;" size="small">
        <el-form-item v-show="value.orderId" >
          <el-button style="margin: 20px 40px 20px 0" v-if="value.registerStatus===0||value.registerStatus===1" type="primary" size="medium" @click="checkIn.show=true">入住登记</el-button>
          <el-button style="margin: 20px 20px 20px 20px" v-if="value.registerStatus===1" type="primary" size="medium" @click="handleCheckOut">退房</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog
      title="入住登记"
      :visible.sync="checkIn.show"
      width="30%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="姓名:">
          <el-input  v-model="checkIn.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="身份证号:">
          <el-input  v-model="checkIn.cardId" placeholder="请输入身份证号"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button  @click="checkIn.show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleCheckIn" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
  import {getDetail,checkOut,checkPeople} from '@/api/check';
  import {
      formatDate as formatDate1
  }from '@/utils/date';
    export default {
        name: "check",
        data(){
            return{
                form:null,
                key:null,
                orderSn:null,
                value:{
                    orderId:null,
                    orderSn:null,
                    roomName:null,
                    floor:null,
                    serial:null,
                    people:[],
                    registerStatus:null,
                },
                checkIn:{
                    show:false,
                    name:null,
                    cardId:null,
                },
            }
        },
        created(){
          if (this.$route.query.id!=null){
              this.orderSn=this.$route.query.id;
              this.geOrderDetail();
          }
        },
        filters:{
            formatStatus(status){
                if (status===1){
                    return "已付款";
                }else if (status===2){
                    return "已取消";
                }else {
                    return "未付款";
                }
            },
            formatRegisterStatus(status){
                if (status===1){
                    return "已登记入住";
                }else if (status===2){
                    return "已退房";
                }else {
                    return "未登记";
                }
            },
            formatDateTime(time) {
                let date = new Date(time);
                return formatDate1(date, 'yyyy-MM-dd hh:mm:ss')
            },
        },
        methods:{
            search(){
                this.geOrderDetail();
            },
            handleCheckIn(){
                if (this.checkIn.name==null||this.checkIn.name.length===0){
                    this.$message({
                        message: '请输入姓名',
                        type: 'error',
                        duration: 1000
                    });
                    return;
                }
                if (this.checkIn.cardId==null||this.checkIn.cardId.length===0){
                    this.$message({
                        message: '请输入身份证号',
                        type: 'error',
                        duration: 1000
                    });
                    return;
                }
                let params={
                    "orderId":this.value.orderId,
                    "name":this.checkIn.name,
                    "cardId": this.checkIn.cardId,
                };
                checkPeople(params).then((response)=>{
                    this.$message({
                        message: '登记成功',
                        type: 'success',
                        duration: 1000
                    });
                    this.checkIn.show=false;
                    this.checkIn.name=null;
                    this.checkIn.cardId=null;
                    this.geOrderDetail();
                })
            },
            handleCheckOut(){
                this.$confirm('是否要确认?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    checkOut(this.value.orderId).then(()=>{
                        this.$message({
                            message: '退房成功',
                            type: 'success',
                            duration: 1000
                        });
                        this.geOrderDetail();
                    });

               });
            },

            geOrderDetail(){
                let params={"orderSn":this.orderSn};
                getDetail(params).then((response)=>{
                    this.value=response.data;
                    this.$message({
                        message: '查询订单成功',
                        type: 'success',
                        duration: 1000
                    });
                })
            }
        }
    }
</script>

<style scoped>
  .un-handle-layout {
    margin-bottom: 40px;
    border: 1px solid #DCDFE6;
  }
  .layout-title {
    margin-top: 40px;
    color: #606266;
    padding: 15px 20px;
    background: #F2F6FC;
    font-weight: bold;
  }
  .un-handle-content {
    padding: 20px 40px;
  }
  .out-border {
    border: 1px solid #DCDFE6;
  }
  .table-layout {
    margin-button: 20px;
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }
  .table-cell-title {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    text-align: center;
    font-size: 14px;
    color: #303133;
  }
  .table-cell {
    height: 60px;
    line-height: 40px;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
  }
</style>
