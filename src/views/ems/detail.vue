<template>
  <event-detail :option="option"></event-detail>
</template>

<script>
    import EventDetail from './components/EventDetail'
    export default {
        name: "detailEvent",
        components: { EventDetail },
        data(){
            return{
                option:"detail"
            }
        }
    }
</script>

<style scoped>

</style>
