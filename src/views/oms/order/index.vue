<template> 
  <div class="app-container">

    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="handleSearchList()"
          type="primary"
          size="small">
          查询结果
        </el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="订单号：">
            <el-input style="width: 203px" v-model="listQuery.orderSn" placeholder="订单号"></el-input>
          </el-form-item>
          <el-form-item label="身份证号：">
            <el-input style="width: 203px" v-model="listQuery.cardId" placeholder="身份证号"></el-input>
          </el-form-item>
          <el-form-item label="订单用户名：">
            <el-input style="width: 203px" v-model="listQuery.username" placeholder="订单用户名"></el-input>
          </el-form-item>
          <el-form-item label="订单状态：">
            <el-select v-model="listQuery.status" placeholder="全部" clearable>
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="支付类型：">
            <el-select v-model="listQuery.payType" placeholder="全部" clearable>
              <el-option
                v-for="item in payTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="订单类型：">
            <el-select v-model="listQuery.orderType" placeholder="全部" clearable>
              <el-option
                v-for="item in orderTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

        </el-form>
      </div>
    </el-card>

    <div class="table-container">
      <el-table ref="productTable"
                :data="list"
                style="width: 100%"
                v-loading="listLoading"
                border>
        <el-table-column label="ID" width="50" align="center"><template slot-scope="scope">{{scope.row.id}}</template></el-table-column>
        <el-table-column label="订单编号" width="100" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.orderSn}}</template>
        </el-table-column>
        <el-table-column label="身份证号" width="140" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.cardId}}</template>
        </el-table-column>
        <el-table-column label="订单用户名" width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">{{scope.row.username}}</template>
        </el-table-column>
        <el-table-column label="应付金额(元)"  width="100" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.payAmount}}</template>
        </el-table-column>
        <el-table-column label="支付方式" width="100" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.payType | formatPayType}}</template>
        </el-table-column>
        <el-table-column label="订单状态" width="100" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.status | formatStatus}}</template>
        </el-table-column>
        <el-table-column label="来源类型" width="100" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.sourceType | formatSourceType}}</template>
        </el-table-column>
        <el-table-column label="订单类型" width="100" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.orderType |formatOrderType}}</template>
        </el-table-column>
        <el-table-column label="备注"  align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.note}}</template>
        </el-table-column>
        <el-table-column label="登记入住" width="125" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.registerStatus| formatRegisterStatusTime}}</template>
        </el-table-column>
        <el-table-column label="支付时间" width="125" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.paymentTime| formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="创建时间" width="125" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.createTime| formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="修改时间" width="125" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.modifyTime| formatDateTime}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="210" align="center">
          <template slot-scope="scope">
              <el-button
                class="operate-button"
                size="mini"
                @click="handleDetail(scope.$index, scope.row)">查看订单
              </el-button>
              <el-button
                class="operate-button"
                v-if="scope.row.status===0"
                size="mini"
                type="danger"
                @click="handleCancel(scope.$index, scope.row)">取消订单
              </el-button>
              <el-button class="operate-button"
                         v-if="scope.row.status===1&&scope.row.registerStatus!==2"
                         size="mini"
                         @click="handleRegister(scope.$index, scope.row)">入住/退房
              </el-button>
              <el-button class="operate-button"
                         v-if="scope.row.status===0"
                         size="mini"
                         @click="handleCommit(scope.$index, scope.row)">线下支付
              </el-button>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15,20]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      title="线下支付"
      :visible.sync="locationPayment.show"
      width="30%">
      <el-input type="password" v-model="locationPayment.commitPassword" placeholder="请输入密码"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="locationPayment.show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleLocationPaymentDialogConfirm" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

  import {
    fetchList,
      cancel,
      commit,
  } from '@/api/order';
  import {
      formatDate as formatDate1
  }from '@/utils/date';
  const defaultListQuery = {
      pageNum: 1,
      pageSize: 5,
      orderSn: null,
      username: null,
      roomName: null,
      status:null,
      payType:null,
      orderType:null,
      cardId:null,
      orderSn:null,
  };
  export default {
    name: "orderList",
    data() {
      return {
        //下拉列表参数
        payTypeOptions: [{
            value: 0,
            label: '未支付'
        }, {
            value: 1,
            label: '支付宝'
        }, {
            value: 2,
            label: '微信'
        }, {
            value: 3,
            label: '现金'
        }],
        statusOptions:[{
            value: 0,
            label: '未付款'
        }, {
            value: 1,
            label: '已付款'
        }],
        orderTypeOptions:[{
              value: 0,
              label: '正常订单'
          }, {
              value: 1,
              label: '秒杀订单'
          }],
        //列表数据相关
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        //加载状态
        listLoading: true,
        //线下提交密码输入框转台
        locationPayment:{
            //弹出框状态
            show:false,
            //选取线下支付的订单号
            orderId:null,
            commitPassword:null
        },


      }
    },
    created() {
      this.getList();
    },
    watch: {
    },
      filters: {
          formatDateTime(time) {
              let date = new Date(time);
              return formatDate1(date, 'yyyy-MM-dd hh:mm:ss')
          },
          formatRegisterStatusTime(status){
              if (status===1){
                  return "已登记";
              }else  if (status===2){
                  return "已退房";
              }else {
                  return "未登记";
              }
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

    methods: {
        handleSearchList() {
            this.listQuery.pageNum = 1;
            this.getList();
        },
        getList() {
            this.listLoading = true;
            fetchList(this.listQuery).then(response => {
                this.listLoading = false;
                this.list = response.data.list;
                this.total = response.data.total;
            });
        },
        handleDetail(index,row){
            this.$router.push({path:"/oms/detailOrder",query:{id:row.id}})
        },
        handleRegister(index,row){
            this.$router.push({path:"/cms/check",query:{id:row.orderSn}})
        },
        handleCancel(index,row){
            this.$confirm('是否要确认?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.listLoading = true;
                cancel(row.id).then(response => {
                    this.$message({
                        message: '订单取消成功',
                        type: 'success',
                        duration: 1000
                    });
                    this.getList();
                    this.listLoading = false;
                }).catch(e=>{
                    this.$message({
                        message: '订单取消失败',
                        type: 'error',
                        duration: 1000
                    });
                    this.listLoading = false;
                });
            });
        },
        handleCommit(index,row){
            this.locationPayment.show=true;
            this.locationPayment.orderId=row.id;
        },
        handleLocationPaymentDialogConfirm(){
            if (this.locationPayment.orderId===null){
                this.$message({
                    message: '未选取订单，请关闭弹出框重新选取',
                    type: 'error',
                    duration: 1000
                });
            }else if (this.locationPayment.commitPassword===null||this.locationPayment.commitPassword.length===0){
                this.$message({
                    message: '请输入密码',
                    type: 'error',
                    duration: 1000
                });
            }else {
                let params={
                    "orderId":this.locationPayment.orderId,
                    "commitPassword":this.locationPayment.commitPassword
                };
                commit(params).then((response)=>{
                    this.$message({
                        message: '线下支付成功',
                        type: 'success',
                        duration: 1000
                    });
                    this.locationPayment.show=false;
                    this.getList();
                })
            }
        },
        //重置搜索条件
        handleResetSearch() {
            this.listQuery = Object.assign({}, defaultListQuery);
        },
        //改变页长
        handleSizeChange(val) {
            this.listQuery.pageNum = 1;
            this.listQuery.pageSize = val;
            this.getList();
        },
        //翻页
        handleCurrentChange(val) {
            this.listQuery.pageNum = val;
            this.getList();
        },
      },
  }
</script>
<style>
  .el-table .cell {
    white-space: nowrap;   //强制不换行
  overflow: hidden; //溢出隐藏
  text-overflow: ellipsis  //替换为省略号
  }
  .operate-button{
    float: left;
    margin: 10px 0px 0 10px;
  }
</style>


