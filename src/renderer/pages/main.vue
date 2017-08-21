<template lang="html">
    <div class="main">
        <side-menu></side-menu>
        <textRrsouce></textRrsouce>
    </div>
</template>

<script>
    import sideMenu from "@/components/sideMenu"
    import textRrsouce from "@/components/textResource"
    export default {
        components:{
            sideMenu,
            textRrsouce,
        },
    }
</script>

<style lang="scss">
    .main{
        height:100vh;
        width:100vw;
        display: flex;
        justify-content: space-between;
    }
</style>
