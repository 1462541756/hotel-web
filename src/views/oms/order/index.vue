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
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAddOrder()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable"
                :data="list"
                style="width: 100%"
                v-loading="listLoading"
                border>
        <el-table-column label="ID" width="50" align="center"><template slot-scope="scope">{{scope.row.id}}</template></el-table-column>
        <el-table-column label="订单编号" width="140" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.orderSn}}</template>
        </el-table-column>
        <el-table-column label="订单用户名" width="140" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">{{scope.row.username}}</template>
        </el-table-column>
        <el-table-column label="应付金额"  width="100" align="center" :show-overflow-tooltip="true">
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
        <el-table-column label="支付时间" width="140" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.paymentTime| formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="评价时间" width="140" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.commentTime| formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="创建时间" width="140" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.createTime| formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="修改时间" width="140" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.modifyTime| formatDateTime}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <p>
              <el-button
                size="mini"
                @click="handleDetail(scope.$index, scope.row)">查看订单
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleCancel(scope.$index, scope.row)">取消订单
              </el-button>
            </p>
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
  </div>
</template>
<script>

  import {
    fetchList,
      cancel,
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
              } else {
                  return '未付款';
              }
          }
      },

    methods: {
        handleAddOrder(){
            this.$router.push({path:'/oms/addOrder'})
        },
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
            this.$router.push({path:"/oms/detail/",query:{id:row.id}})
        },
        handleCancel(index,row){
            this.listLoading = true;
            cancel(row.id).then(response => {
                this.listLoading = false;
                fetchList();
            });
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
</style>


