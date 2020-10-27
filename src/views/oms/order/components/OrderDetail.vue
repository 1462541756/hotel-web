<template> 
  <el-card class="form-container" shadow="never">
    <el-form   :model="value" :rules="rules" ref="orderInfoForm" label-width="120px" style="width: 600px;" size="small">
      <el-form-item label="订单编号："   >
        {{value.orderSn}}
      </el-form-item>
      <el-form-item label="订单用户名："  >
        {{value.username}}
      </el-form-item>
      <el-form-item label="身份证号："  >
        {{value.cardId}}
      </el-form-item>
      <el-form-item label="应付金额(元)："  >
        {{value.payAmount}}
      </el-form-item>
      <el-form-item label="支付方式："  >
        {{value.payType | formatPayType}}
      </el-form-item>
      <el-form-item label="订单状态："  >
        {{value.status | formatStatus}}
      </el-form-item>
      <el-form-item label="来源类型："  >
        {{value.sourceType | formatSourceType}}
      </el-form-item>
      <el-form-item label="订单类型：" >
        {{value.orderType | formatOrderType}}
      </el-form-item>
      <el-form-item label="支付时间：" prop="payTime" >
        {{value.paymentTime | formatDateTime}}
      </el-form-item>
      <el-form-item label="评价时间：" prop="commentTime" >
        {{value.commentTime  | formatDateTime}}
      </el-form-item>
      <el-form-item label="创建时间：" prop="createTime" >
        {{value.createTime  | formatDateTime}}
      </el-form-item>
      <el-form-item label="修改时间：" prop="modifyTime" >
        {{value.modifyTime   | formatDateTime}}
      </el-form-item>
      <el-form-item label="房间名字：" prop="roomName" >
        {{value.roomName}}
      </el-form-item>
      <el-form-item label="楼层号：" prop="floor">
        {{value.floor}}
      </el-form-item>
      <el-form-item label="房间号：" prop="serial" >
        {{value.serial}}
      </el-form-item>

      <el-form-item label="图片：" prop="pic">
        <img style="height: 80px;overflow: hidden"  v-for="img in pics" :src="img" alt="图片">
      </el-form-item>


      <el-form-item label="备注：" prop="note">
        <el-input
          :disabled="true"
          :rows="4"
          :autoSize="true"
          v-model="value.note"
          type="textarea"
          placeholder="请输入内容" clearable></el-input>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button type="primary" size="medium" @click="handleBack">返回</el-button>
      </el-form-item>
    </el-form>

    <el-dialog
      title="提交密码"
      :visible.sync="commit"
      width="30%">
      <el-input v-model="commitPassword" placeholder="请输入提交密码"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="commit = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleCommitConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
    import {
        getOrderById,
        commitOrder,
    } from '@/api/order';
    import {
        formatDate as formatDate1
    }from '@/utils/date';
    import MultiUpload from '@/components/Upload/multiUpload';
    const defaultOrderParam = {
        pageNum: 1,
        pageSize: 5,
        orderSn: null,
        username:null,
        status:null,
        payType:null,
        orderType:null,
        roomName: null,
        floor:null,
        serial:null,
        pic:null,
        cardId:null
    };
    export default {
        name: "orderDetail",
        props: {
            operate: {
                type: Number,
                default: 0    //0为查看，1为添加，2为修改
            }
        },
        components:{MultiUpload},
        data() {
            return {
                pics:[],
                value: Object.assign({}, defaultOrderParam),
                resetValue: Object.assign({}, defaultOrderParam),
                rules: {
                },
                commit:false,
                commitPassword:'',
                orderId:null,
            }
        },
        created() {
            getOrderById(this.$route.query.id).then(response=>{
                this.value=response.data;
                this.pics=this.value.pic.split(",");
            }).catch(e=>{
                console.log(e)
            });
        },
        computed:{
        },
        filters: {
            formatDateTime(time) {
                let date = new Date(time);
                return formatDate1(date, 'yyyy-MM-dd hh:mm:ss')
            },
            formatPayType(value) {
                if (value === 1) {
                    return '支付宝';
                } else if (value === 2) {
                    return '微信';
                } else if (value === 3) {
                    return '现金';
                }else {
                    return '未支付';
                }
            },
            formatSourceType(value) {
                if (value === 0) {
                    return 'PC';
                } else if (value === 1) {
                    return 'APP';
                } else {
                    return '线下';
                }
            },
            formatOrderType(value) {
                if (value === 1) {
                    return '秒杀订单';
                } else {
                    return '正常订单';
                }
            },
            formatStatus(value){
                if (value === 1) {
                    return '已付款';
                } else if (value===2){
                    return '已取消'
                }else {
                    return '未付款';
                }
            }
        },
        methods:{
            handleCommit(index, row){
                if (this.operate===0){
                    this.commit=true;
                }else {
                    this.$message({
                        message: '该订单无法提交',
                        type: 'error',
                        duration: 1000
                    });
                }

            },
            handleCommitConfirm(){
                this.$confirm('是否要确认?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = new URLSearchParams();
                    params.append("commitPassword", this.commitPassword);
                    params.append("orderId", this.orderId);
                    commitOrder(params).then(response => {
                        this.$message({
                            message: '订单提交成功！',
                            type: 'success'
                        });
                        this.commit = false;
                    })
                })
            },
            handleReset(index, row){
                if(this.operate===2){
                    getOrderById(this.$route.query.id).then(response=>{
                        this.value=response.data;
                        this.$message({
                            message: '重置完成',
                            type: 'success',
                            duration: 1000
                        });
                    });
                }else {
                    this.value=Object.assign({}, defaultRoomParam);
                }
            },
            handleBack(){
                this.$router.push({path:'/oms/order'})
            },

        }
    }
</script>

<style scoped>
</style>
