<template> 
  <order-detail :operate='0'></order-detail>
</template>
<script>
  import OrderDetail from './components/OrderDetail'
  export default {
    name: 'detailOrder',
    components: { OrderDetail }
  }
</script>
<style>
</style>
