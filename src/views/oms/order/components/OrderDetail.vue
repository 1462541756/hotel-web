<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="value" :rules="rules" ref="roomInfoForm" label-width="120px" style="width: 600px" size="small">
      <el-form-item label="房间名：" prop="name" >
        <el-input v-model="value.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="图片：" prop="pic">
        <multi-upload v-model="selectProductPics"></multi-upload>
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
        <el-button type="primary" size="medium" @click="handleBack">返回</el-button>
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
    export default {
        name: "orderDetail",
        props: {

        },
        components:{MultiUpload},
        data() {
            return {
            }
        },
        created() {
        },
        computed:{
        },
        methods:{


        }
    }
</script>

<style scoped>

</style>
