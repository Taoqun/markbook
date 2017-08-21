<template lang="html">
    <div class="side-menu-wrap">
        <!-- <el-button type="success" v-show="!list.length">打开文件夹</el-button> -->
        <button type="button" name="button" class="open-folder" @click="openFolder" v-show="!list.length">打开文件夹</button>
        <filelist v-for="item in list" :item="item"></filelist>
    </div>
</template>

<script>
    import filelist from "./filelist"
    export default {
        name:"sideMenu",
        components:{
            filelist,
        },
        data(){
            return{
                list:[
                    // {
                    //     name:'论前后端分离的必须注意事项论前后端分离的必须注意事项论前后端分离的必须注意事项.md',
                    //     type:'file',
                    //     path:'/Users/taoqun/Desktop/test.js',
                    //     child:[],
                    // }
                ],
                fs:require("fs"),
            }
        },
        created(){

        },
        mounted(){
            this.listener()
        },
        methods:{
            openFolder(){
                this.$electron.ipcRenderer.send("open-folder","folder")
            },
            listener(){
                this.$electron.ipcRenderer.on("get-folder",(event,res)=>{
                    // this.getfile(this.list,res[0])
                    // 直接读取目录下文件列表
                    this.getFolderlist(this.list,[],[],res[0])
                    // console.log(this.list)
                })
            },
            // 想法1 ： 读取传过来的主目录下的文件列表 => 依次读取主目录下的所有文件和目录 => 遇到目录再次读取 => 直至全部读取完毕
            // 想法2 ： 直接读取传过来的主目录下的文件列表 => 主目录下的文件夹不在此读取，操作点击后再次读取 => 优化性能
            getfile(list,filelist,folderlist,path){
                let stats = this.fs.statSync(path)
                let name = path.split('/')
                    name = name[name.length-1]
                if( stats.isFile() && /\.md$/.test(name) ){
                    let obj = {name,path,
                        type:'file'}
                    filelist.push(obj)
                }else if( stats.isDirectory() ){
                    let obj = {name,path,
                        type:"folder",
                        childShow:false,
                        child:[]}
                    folderlist.push(obj)
                    // 取消再次读取目录下的目录
                    // this.getFolderlist(obj.child,path)
                }
            },
            getFolderlist(list,filelist,folderlist,path){
                let files = this.fs.readdirSync(path)
                    files.forEach((file)=>{
                        this.getfile(list,filelist,folderlist,path+'/'+file)
                    })
                folderlist.map((arr)=>{
                    list.push(arr)
                })
                filelist.map((arr)=>{
                    list.push(arr)
                })
            },
        },
    }
</script>

<style lang="scss">
    .side-menu-wrap{
        background-color:#C0CCDA;
        padding:0;
        height:100vh;
        width:200px;
        min-width:150px;
        overflow:auto;
        position:relative;

        #activeBgBar,#fileHoverBar{
            position:absolute;
            top:0;
            left:0;
            width:100%;
            background-color:#475669;
            transition: all 0s linear;
            z-index:0;
        }
        .open-folder{
            width:100%;
            border:none;
            padding:20px;
            font-size:14px;
            color:#fff;
            background-color: #324057;
            transition:all 0.1s linear;

            &:hover{
                opacity:0.8;
            }
        }
    }
</style>
