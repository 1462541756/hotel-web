<template> 
  <order-detail :operate='2'></order-detail>
</template>
<script>
  import OrderDetail from './components/OrderDetail'
  export default {
    name: 'updateOrder',
    components: { OrderDetail }
  }
</script>
<style>
</style>
