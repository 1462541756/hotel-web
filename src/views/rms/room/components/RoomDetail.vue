<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="value" :rules="rules" ref="roomInfoForm" label-width="120px" style="width: 600px" size="small">
      <el-form-item label="房间名：" prop="name" >
        <el-input v-model="value.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="楼层号：" prop="floor">
        <el-input type="number" v-model="value.floor" clearable></el-input>
      </el-form-item>
      <el-form-item label="房间号：" prop="serial">
        <el-input v-model="value.serial" clearable></el-input>
      </el-form-item>
      <el-form-item label="价格(元)：" prop="price">
        <el-input type="number"  v-model="value.price"></el-input>
      </el-form-item>
      <el-form-item  label="空闲状态：" prop="status">
<!--        <el-input  v-model="value.status" ></el-input>-->
        <el-select style="width: 100%;"  v-model="value.status" placeholder="请选择">
          <el-option
            v-for="item in roomOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="清洁状态：" prop="clean">
<!--        <el-input v-model="value.clean"></el-input>-->
        <el-select style="width: 100%;"  v-model="value.clean" placeholder="请选择">
          <el-option
            v-for="item in cleanOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="维修状态：" prop="maintenance">
<!--        <el-input v-model="value.maintenance"></el-input>-->
        <el-select style="width: 100%;"  v-model="value.maintenance" placeholder="请选择">
          <el-option
            v-for="item in maintenanceOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序：" prop="sort">
        <el-input  v-model="value.sort"></el-input>
      </el-form-item>
      <el-form-item label="图片：" prop="pic">
        <multi-upload v-model="selectRoomPics"></multi-upload>
      </el-form-item>
      <el-form-item label="描述：" prop="description">
        <el-input
          :rows="4"
          :autoSize="true"
          v-model="value.description"
          type="textarea"
          placeholder="请输入内容" clearable></el-input>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button type="primary" size="medium" @click="handleCommit">提交</el-button>
        <el-button size="medium" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
    import {
        updateRoom,
        addRoom,
        getRoomById
    } from '@/api/room'
    import MultiUpload from '@/components/Upload/multiUpload'
    const defaultRoomParam = {
        description: null,
        floor: null,
        serial: null,
        clean: null,
        status: null,
        maintenance: null,
        pic: null,
        sort: null,
        price: null
    };
    export default {
        name: "roomDetail",
        props: {
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        components:{MultiUpload},
        data() {
            return {
                value: Object.assign({}, defaultRoomParam),
                resetValue: Object.assign({}, defaultRoomParam),
                rules: {
                },
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
                roomOptions: [{
                    value: 1,
                    label: '空闲'
                }, {
                    value: 0,
                    label: '不可用'
                }],
            }
        },
        created() {
            if(this.isEdit){
                getRoomById(this.$route.query.id).then(response=>{
                    this.value=response.data;
                });
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
        methods:{
            handleCommit(){
                if (this.isEdit){
                    updateRoom(this.value).then(response => {
                        this.$message({
                            message: '修改成功',
                            type: 'success',
                            duration: 1000
                        });
                        this.$router.push({path:'/rms/room'});
                    });
                }else {
                    addRoom(this.value).then(response => {
                        this.$message({
                            message: '添加成功',
                            type: 'success',
                            duration: 1000
                        });
                        this.$router.push({path:'/rms/room'});
                    });
                }

            },
            handleReset(){
                if(this.isEdit){
                    getRoomById(this.$route.query.id).then(response=>{
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
