<template>
  <event-detail :option="option"></event-detail>
</template>

<script>
    import EventDetail from './components/EventDetail'
    export default {
        name: "updateEvent",
        components: { EventDetail },
        data(){
            return{
                option:"update"
            }
        }
    }
</script>

<style scoped>

</style>

