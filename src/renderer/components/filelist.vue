<template lang="html">
        <div>
            <div v-if='item.type === "folder"' class="folder">
                <h6 @click="toggleShow" @mouseover="onfile" @mouseout="offfile">
                    <i :class='item.childShow ? "iconfont icon-jiantou":"iconfont icon-right" '></i>
                    <i class='iconfont icon-wenjianjia-copy'></i>
                     {{item.name}}
                 </h6>
                <ul v-show="item.childShow">
                    <filelist v-for="child in item.child" :item="child"></filelist>
                </ul>
            </div>
            <filetag v-if='item.type === "file"' :file="item"></filetag>
        </div>
</template>

<script>
    import filetag from "./file"

    export default {
        name:'filelist',
        components:{
            filetag,
        },
        props:{
            item:{
                type:Object,
            }
        },
        created(){

        },
        data(){
            return{
                fs: require("fs"),
            }
        },
        methods:{
            toggleShow(){
                let the = event.target
                let tag = the.tagName.toLowerCase()

                this.clearActive()

                if( tag === 'i' ){
                    the = the.parentNode
                }
                the.className += " active"
                this.item.childShow = !this.item.childShow
                this.clickActive(event.target)
                if( this.item.childShow ){
                    this.item.child = []
                    this.getFolderlist(this.item.child,[],[],this.item.path)
                }
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
            clearActive(){
                let Folderlist = document.querySelectorAll(".side-menu-wrap .folder h6")
                let filelist = document.querySelectorAll(".side-menu-wrap .file")

                Array.prototype.map.call(filelist,(obj)=>{
                    obj.className = obj.className.replace("active",'').trim()
                })
                Array.prototype.map.call(Folderlist,(obj)=>{
                    obj.className = obj.className.replace("active",'').trim()
                })
            },
            onfile(){
                let the = event.target

                if( the.tagName && the.tagName.toLowerCase() === 'i' ){
                    the = the.parentNode
                }
                this.activeBgBar( the.offsetHeight,the.offsetTop,'fileHoverBar' )
            },
            clickActive(the){

                if( the.tagName.toLowerCase() === 'i' ){
                    the = the.parentNode
                }

                this.activeBgBar( the.offsetHeight,the.offsetTop )
            },
            offfile(){
                this.activeBgBar( 0,0,'fileHoverBar' )
            },
            activeBgBar(height,top,id){
                id = id || "activeBgBar"
                let bar = document.querySelector("#"+id)

                if(!bar){
                    bar = document.createElement("div")
                    bar.id = id
                    bar.style.height = height + 'px'
                    bar.style.top = top + 'px'
                    document.querySelector(".side-menu-wrap").insertBefore(bar,document.querySelector(".side-menu-wrap").firstChild )
                }

                bar.style.height = height + 'px'
                bar.style.top = top + 'px'
            }
        }
    }
</script>

<style lang="scss">
    .folder .folder{
        margin-left:20px;
        // border-bottom:1px solid rgba(0,0,0,0.2);
        // border-left:1px solid rgba(0,0,0,0.2);
    }
    .folder .file{
        margin-left:20px;
    }
    .folder{
        margin:0;
        user-select:none;
        z-index:5;

        h6{
            z-index:5;
            padding:0 10px;
            color:#475669;
            padding:5px 10px;
            font-size:14px;
            font-weight:normal;
            line-height:1;
            letter-spacing: 1px;
            position:relative;
            margin:3px 0;
            text-overflow:ellipsis;
            overflow:hidden;
            white-space: nowrap;
        }
        h6.active,h6:hover{
            z-index:5;
            color:#F9FAFC;
            background-color:#475669;
            cursor:default;
        }
    }
</style>
