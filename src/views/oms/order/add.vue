<template> 
  <order-detail :operate='1'></order-detail>
</template>
<script>
  import OrderDetail from './components/OrderDetail'
  export default {
    name: 'addOrder',
    components: { OrderDetail }
  }
</script>
<style>
</style>
