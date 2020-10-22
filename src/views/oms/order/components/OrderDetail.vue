<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="value" :rules="rules" ref="orderInfoForm" label-width="120px" style="width: 600px" size="small">
      <el-form-item label="订单编号：" prop="orderSn" >
        <el-input v-model="value.orderSn" clearable></el-input>
      </el-form-item>
      <el-form-item label="订单用户名：" prop="username" >
        <el-input v-model="value.username" clearable></el-input>
      </el-form-item>
      <el-form-item label="应付金额：" prop="payAmount" >
        <el-input v-model="value.payAmount" clearable></el-input>
      </el-form-item>
      <el-form-item label="支付方式：" prop="payType" >
        <el-input v-model="value.payType" clearable></el-input>
      </el-form-item>
      <el-form-item label="订单状态：" prop="status" >
        <el-input v-model="value.status" clearable></el-input>
      </el-form-item>
      <el-form-item label="来源类型：" prop="sourceType" >
        <el-input v-model="value.sourceType" clearable></el-input>
      </el-form-item>
      <el-form-item label="订单类型：" prop="orderType" >
        <el-input v-model="value.orderType" clearable></el-input>
      </el-form-item>
      <el-form-item label="支付时间：" prop="payTime" >
        <el-input v-model="value.payTime" clearable></el-input>
      </el-form-item>
      <el-form-item label="评价时间：" prop="commentTime" >
        <el-input v-model="value.commentTime" clearable></el-input>
      </el-form-item>
      <el-form-item label="创建时间：" prop="createTime" >
        <el-input v-model="value.createTime" clearable></el-input>
      </el-form-item>
      <el-form-item label="修改时间：" prop="modifyTime" >
        <el-input v-model="value.modifyTime" clearable></el-input>
      </el-form-item>

      <el-form-item label="房间名字：" prop="roomName" >
        <el-input v-model="value.roomName" clearable></el-input>
      </el-form-item>
      <el-form-item label="楼层号：" prop="floor" >
        <el-input v-model="value.floor" clearable></el-input>
      </el-form-item>
      <el-form-item label="房间号：" prop="serial" >
        <el-input v-model="value.serial" clearable></el-input>
      </el-form-item>
      <el-form-item label="图片：" prop="pic">
        <multi-upload v-model="selectProductPics"></multi-upload>
      </el-form-item>

      <el-form-item label="备注：" prop="note">
        <el-input
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
  </el-card>
</template>

<script>
    import {
        getOrderById,
        updateOrder,
        addOrder,
    } from '@/api/order'
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
                value: Object.assign({}, defaultOrderParam),
                resetValue: Object.assign({}, defaultOrderParam),
                rules: {
                }
            }
        },
        created() {
           switch (this.operate) {
               case 1:{
                   break;
               }
               case 2:{
                   break;
               }
               default:{
                   getOrderById(this.$route.query.id).then(response=>{
                       this.value=response.data;
                   });
               }
           }
        },
        computed:{
            selectProductPics:{
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
        methods:{
            handleCommit(){
                if (this.operate===2){
                    updateOrder(this.value).then(response => {
                        this.$message({
                            message: '修改成功',
                            type: 'success',
                            duration: 1000
                        });
                        this.$router.push({path:'/oms/order'});
                    });
                }else if (this.operate===1){
                    addOrder(this.value).then(response => {
                        this.$message({
                            message: '添加成功',
                            type: 'success',
                            duration: 1000
                        });
                        this.$router.push({path:'/oms/order'});
                    });
                }

            },
            handleReset(){
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

        }
    }
</script>

<style scoped>

</style>
