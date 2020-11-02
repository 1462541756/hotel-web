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
          <el-form-item label="描述：">
            <el-input style="width: 203px" v-model="listQuery.description" placeholder="描述"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAddReport()"
        size="mini">
        上报
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="eventTable"
                :data="list"
                style="width: 100%"
                v-loading="listLoading"
                border>
        <el-table-column label="编号" width="100" align="center"><template slot-scope="scope">{{scope.row.id}}</template></el-table-column>
        <el-table-column label="事件名" width="140" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.subject}}</template>
        </el-table-column>
        <el-table-column label="类别" width="100" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.type}}</template>
        </el-table-column>
        <el-table-column label="描述"  align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.description}}</template>
        </el-table-column>
        <el-table-column label="上报人" width="100" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.reportPeople}}</template>
        </el-table-column>
        <el-table-column label="处理状态" width="100" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.status | formatStatus}}</template>
        </el-table-column>
        <el-table-column label="处理人" width="100" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.handlePeople}}</template>
        </el-table-column>
        <el-table-column label="审核状态" width="120" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.checkStatus|formatCheckStatus}}</template>
        </el-table-column>
        <el-table-column label="审核人" width="120" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.checkPeople}}</template>
        </el-table-column>
        <el-table-column label="审核意见" width="120" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.checkOpinion}}</template>
        </el-table-column>
        <el-table-column label="创建时间" width="120" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.createTime|formatDateTime}}</template>
        </el-table-column>

        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <p>
              <el-button
                class="operate"
                size="mini"
                @click="handleDetailEvent(scope.$index, scope.row)">查看详情
              </el-button>
              <el-button
                v-if="(scope.row.checkStatus===0||scope.row.checkStatus===2) && scope.row.reportPeople===user"
                class="operate"
                size="mini"
                type="primary"
                @click="handleEditEvent(scope.$index, scope.row)">编辑
              </el-button>
              <el-button
                v-if="(scope.row.checkStatus===0||scope.row.checkStatus===2) && scope.row.reportPeople===user&&hashAuthority('/event/reportFromDraft/**')"
                class="operate"
                size="mini"
                type="primary"
                @click="handleReportEvent(scope.$index, scope.row)">上报事件
              </el-button>
              <el-button
                v-if="scope.row.checkStatus===1 && scope.row.reportPeople===user"
                class="operate"
                size="mini"
                type="warning"
                @click="handleCancelEvent(scope.$index, scope.row)">取消上报
              </el-button>

              <el-button
                v-if="scope.row.status===0 && scope.row.checkStatus===3"
                class="operate"
                size="mini"
                type="primary"
                @click="handleReceiveEvent(scope.$index, scope.row)">接收
              </el-button>
              <el-button
                v-if="scope.row.status===1 && scope.row.checkStatus===3"
                class="operate"
                size="mini"
                type="warning"
                @click="handleCommitEvent(scope.$index, scope.row)">提交完成
              </el-button>

              <el-button
                class="operate"
                size="mini"
                type="danger"
                @click="handleDeleteEvent(scope.$index, scope.row)">删除
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
    import {getLoginInfo} from '@/api/admin';
    import {
        fetchList,
        deleteEventById,
        cancelReportById,
        report,
        reportFromDraft
    } from '@/api/event';
    import {
        formatDate as formatDate1
    }from '@/utils/date';
    const defaultListQuery = {
        pageNum: 1,
        pageSize: 5,
    };
    export default {
        name: "eventList",
        data(){
            return{
                //列表数据相关
                listQuery: Object.assign({}, defaultListQuery),
                listLoading:false,
                list:null,
                total:0,
                userInfo:null,
                user:null,
            }
        },
        computed:{
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
        created() {
            this.getUserInfo();
            this.getList();
        },
        methods:{
            hashAuthority(url){
                let resources=  this.userInfo.resources;
                for (let i = 0; i < resources.length; i++) {
                    let item=resources[i].url;
                    if ("/event/**"===item||url===item){
                        return true;
                    }
                }
                return false;
            },
            getUserInfo(){
                getLoginInfo().then((response)=>{
                    this.userInfo=response.data;
                    this.user=response.data.username;
                });
            },
            getList() {
                this.listLoading = true;
                fetchList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.list = response.data.list;
                    this.total = response.data.total;
                });
            },
            handleAddReport(){
                this.$router.push({path:'/ems/reportEvent'})
            },
            handleDetailEvent(index,row){
                this.$router.push({path:"/ems/detailEvent",query:{id:row.id}})
            },
            handleEditEvent(index,row){
                this.$router.push({path:"/ems/updateEvent",query:{id:row.id}})
            },
            handleReportEvent(index,row){

                reportFromDraft(row.id).then(response => {
                    this.$message({
                        message: '上报成功',
                        type: 'success',
                        duration: 1000
                    });
                    this.getList();
                });
            },
            handleCancelEvent(index,row){
                cancelReportById(row.id).then(response => {
                    this.$message({
                        message: '取消上报成功',
                        type: 'success',
                        duration: 1000
                    });
                    this.getList();
                });
            },
            handleDeleteEvent(index,row){
                deleteEventById(row.id).then(response => {
                    this.$message({
                        message: '删除成功',
                        type: 'success',
                        duration: 1000
                    });
                    this.getList();
                });
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

<style scoped>
  .el-table .cell {
    white-space: nowrap;   //强制不换行
  overflow: hidden; //溢出隐藏
  text-overflow: ellipsis  //替换为省略号
  }
  .operate{
    float: left;
    margin: 2px 2px 2px 2px;
  }
</style>
