<template>
  <div >
    <el-input v-model="input" placeholder="测试地址如：/order/cancel/1"></el-input>
    <el-button type="primary" @click="test1">buttonCont</el-button>
  </div>

</template>

<script>
    import {test } from '@/api/test'
    export default {
        name: "test",
        data(){
            return{
                input:'/order/cancel/1'
            }
        },
        methods: {
            test1(){
                test(this.input);
            },
        }
    }
</script>

<style scoped>

</style>
