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
          <el-form-item label="房间描述：">
            <el-input style="width: 203px" v-model="listQuery.description" placeholder="房间描述"></el-input>
          </el-form-item>
          <el-form-item label="楼层号：">
            <el-input style="width: 203px" v-model="listQuery.floor" placeholder="楼层号"></el-input>
          </el-form-item>
          <el-form-item label="房间号：">
            <el-input style="width: 203px" v-model="listQuery.serial" placeholder="房间号"></el-input>
          </el-form-item>
          <el-form-item label="房间状态：">
            <el-select v-model="listQuery.status" placeholder="全部" clearable>
              <el-option
                v-for="item in roomOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="清洁状态：">
            <el-select v-model="listQuery.clean" placeholder="全部" clearable>
              <el-option
                v-for="item in cleanOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="维修状态：">
            <el-select v-model="listQuery.maintenance" placeholder="全部" clearable>
              <el-option
                v-for="item in maintenanceOptions"
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
        @click="handleAddRoom()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable"
                :data="list"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center"><template slot-scope="scope">{{scope.row.id}}</template></el-table-column>
        <el-table-column label="房间图片" width="160" align="center">
          <template slot-scope="scope">
            <img style="height: 80px" :src="getFirstPic(scope.row.pic)">
          </template>
        </el-table-column>
        <el-table-column label="房间名" width="140" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="楼层号" width="140" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.floor}}</template>
        </el-table-column>
        <el-table-column label="房间号" width="140" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.serial}}</template>
        </el-table-column>
        <el-table-column label="清洁状态" width="140" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{getCleanLabel(scope.row.clean)}}</template>
        </el-table-column>
        <el-table-column label="维修" width="140" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{getMaintenanceLabel(scope.row.maintenance)}}</template>
        </el-table-column>
        <el-table-column label="描述"  align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.description}}</template>
        </el-table-column>
        <el-table-column label="排序" width="140" align="center">
          <template slot-scope="scope">{{scope.row.sort}}</template>
        </el-table-column>
        <el-table-column label="空闲状态(不可用/空闲)" width="180" align="center">
          <template slot-scope="scope">
            <p>
              <el-switch
                @change="handlePublishStatusChange(scope.$index, scope.row)"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.status">
              </el-switch>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <p>
              <el-button
                size="mini"
                @click="handleEditRoom(scope.$index, scope.row)">编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDeleteRoom(scope.$index, scope.row)">删除
              </el-button>
            </p>
<!--            <p>
              <el-button
                size="mini"
                @click="handleCleanRoom(scope.$index, scope.row)">清洁
              </el-button>
              <el-button
                size="mini"
                @click="handleMaintainRoom(scope.$index, scope.row)">维修
              </el-button>
            </p>-->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select
        size="small"
        v-model="operateType" placeholder="批量操作">
        <el-option
          v-for="item in operates"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate()"
        type="primary"
        size="small">
        确定
      </el-button>
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
    deleteRoomById,
    updateRoom,
      updateRoomsStatus,
  } from '@/api/room'
  const defaultListQuery = {
      description: null,
      pageNum: 1,
      pageSize: 5,
      floor:null,
      serial:null,
      clean:null,
      status:null,
      maintenance:null,
      pic:null,
  };
  export default {
    name: "roomList",
    data() {
      return {
        //下拉列表参数
        roomOptions: [{
            value: 1,
            label: '空闲'
        }, {
            value: 0,
            label: '不可用'
        }],
        cleanOptions:[{
            value: 0,
            label: '未清洁'
        }, {
            value: 1,
            label: '清洁中'
        }, {
            value: 2,
            label: '已清洁'
        }],
        maintenanceOptions:[{
            value: 0,
            label: '未维修'
        }, {
            value: 1,
            label: '维修中'
        }, {
            value: 2,
            label: '维修完成'
        }],
        //列表数据相关
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        //加载状态
        listLoading: true,
        //批量操作类型
        operateType: null,
        //多选项
        multipleSelection:[],
        //批量操作类型
          operates:[
            {
                label: "切换房间状态为空闲",
                value: "enable"
            },
            {
                label: "切换房间状态为不可用",
                value: "not-enable"
            },
        ],
      }
    },
    created() {
      this.getList();
    },
    watch: {

    },
    filters: {
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
        handleResetSearch() {
            this.listQuery = Object.assign({}, defaultListQuery);
        },

        getCleanLabel(clean){
            switch (clean) {
                case 0:return '未清洁';
                case 1:return '清洁中';
                case 2:return '已清洁';
                default:    return '#';
            }
        },
        getMaintenanceLabel(maintenance){
            switch (maintenance) {
                case 0:return '未维修';
                case 1:return '维修中';
                case 2:return '维修完成';
                default: return '#';
            }
        },
        getFirstPic(pics){
            if (pics == null ||pics == null || pics.length === 0) {
                return  null;
            } else {
                let pic="";
                let pics2 = pics.split(',');
                if (pics2.length>0) pic =pics2[0];
                return pic;
            }
        },
        //添加房间
        handleAddRoom(){
          this.$router.push({path:'/rms/addRoom'});
        },
        handleEditRoom(index,row){
           this.$router.push({path:'/rms/updateRoom',query:{id:row.id}});
        },
        handleDeleteRoom(index,row){
            deleteRoomById(row.id).then(response => {
                this.$message({
                    message: '房间删除成功',
                    type: 'success',
                    duration: 1000
                });
                this.getList();
            });
        },

        handleCleanRoom(){

        },
        handleMaintainRoom(){

        },
        //修改房间空闲状态
        handlePublishStatusChange(index, row){
            let params={
                "id":row.id,
                "status":row.status,
            };
            updateRoom(params).then(response => {
                this.$message({
                    message: '房间状态已修改成功',
                    type: 'success',
                    duration: 1000
                });
            });
        },
        //重置搜索条件
        handleResetSearch() {
            this.listQuery = Object.assign({}, defaultListQuery);
        },
        updateStatus(status,ids){
            let params={
                "ids":ids,
                "status":status,
            };
            updateRoomsStatus(params).then(()=>{
                this.$message({
                    message: '房间状态修改成功',
                    type: 'success',
                    duration: 1000
                });
                this.getList();
            }).catch(()=>{
                this.$message({
                    message: '房间状态修改失败',
                    type: 'error',
                    duration: 1000
                });
            })
        },
        //批量操作
        handleBatchOperate(){
            if(this.operateType==null){
                this.$message({
                    message: '请选择操作类型',
                    type: 'warning',
                    duration: 1000
                });
                return;
            }
            if(this.multipleSelection==null||this.multipleSelection.length<1){
                this.$message({
                    message: '请选择要操作的房间',
                    type: 'warning',
                    duration: 1000
                });
                return;
            }
            this.$confirm('是否要进行该批量操作?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let ids=[];
                for(let i=0;i<this.multipleSelection.length;i++){
                    ids.push(this.multipleSelection[i].id);
                }
                switch (this.operateType) {
                    case this.operates[0].value:
                        this.updateStatus(0,ids);
                        break;
                    case this.operates[1].value:
                        this.updateStatus(1,ids);
                        break;
                    default:
                        break;
                }
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
        //多选项改变
        handleSelectionChange(val) {
            this.multipleSelection = val;
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


