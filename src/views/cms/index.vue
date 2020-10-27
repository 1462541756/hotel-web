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
          <el-form-item label="姓名：">
            <el-input style="width: 203px" v-model="listQuery.name" placeholder="姓名"></el-input>
          </el-form-item>
          <el-form-item label="身份证号：">
            <el-input style="width: 203px" v-model="listQuery.cardId" placeholder="身份证号"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="filter-container"  shadow="never">
      <div class="table-container">
        <el-table ref="checkTable"
                  :data="list"
                  style="width: 100%"
                  v-loading="listLoading"
                  border>
          <el-table-column label="ID"  align="center">
            <template slot-scope="scope">{{scope.row.id}}</template>
          </el-table-column>
          <el-table-column label="订单号"  align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">{{scope.row.orderId}}</template>
          </el-table-column>
          <el-table-column label="姓名"  align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">{{scope.row.name}}</template>
          </el-table-column>
          <el-table-column label="身份证号"  align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">{{scope.row.cardId}}</template>
          </el-table-column>
          <el-table-column label="入住时间"  align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">{{scope.row.checkInTime | formatDateTime}}</template>
          </el-table-column>
          <el-table-column label="退房时间"  align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">{{scope.row.checkOutTime | formatDateTime}}
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
    </el-card>
  </div>
</template>

<script>
  import {getDetail,checkOut,fetchList} from '@/api/check';
  import {
      formatDate as formatDate1
  }from '@/utils/date';
  const defaultListQuery = {
      pageNum: 1,
      pageSize: 5,
      name:null,
      cardId:null,
  };
    export default {
        name: "checkList",
        data(){
            return{
                listLoading:false,
                //列表数据相关
                listQuery: Object.assign({}, defaultListQuery),
                list:null,
                total:0,
            }
        },
        created(){
          this.getList();
        },
        filters:{
            formatDateTime(time) {
                let date = new Date(time);
                return formatDate1(date, 'yyyy-MM-dd hh:mm:ss')
            },
        },
        methods:{
            handleSearchList() {
                this.listQuery.pageNum = 1;
                this.getList();
            },
            getList() {
                this.listLoading = true;
                fetchList(this.listQuery).then(response => {
                    this.list = response.data.list;
                    this.total = response.data.total;
                    this.listLoading = false;
                });
            },
            handleSizeChange(val) {
                this.listQuery.pageNum = 1;
                this.listQuery.pageSize = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.pageNum = val;
                this.getList();
            },
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
