<template>
  <div id="wrapper">
      <button type="button" name="button" @click="getfile">add</button>
      <el-button>222</el-button>
  </div>
</template>

<script>
    import Vue from "vue"
    import SystemInformation from './LandingPage/SystemInformation'
    import electron from "electron"
    import fs from "fs"
    export default {
        name: 'landing-page',
        components: { SystemInformation  },
        created(){
            this.listener()
        },
        methods: {
            listener(){
                this.$electron.ipcRenderer.on("get-folder",(event,res)=>{
                    console.log(res)
                })
            },
            open (link) {
                this.$electron.shell.openExternal(link)
            },
            getfile(){
                this.$electron.ipcRenderer.send("open-folder")
            },
        },
    }
</script>

<style lang="scss">

</style>
