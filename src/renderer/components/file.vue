<template lang="html">
  <li class="file" @click="clickActive" @mouseover="onFile" @mouseout="offfile"><i class="iconfont icon-file"></i>{{file.name}}</li>
</template>

<script>

    import bus from "@/bus"
    export default {
        name:"file",
        props:{
            file:{
                type:Object,
            }
        },
        data(){
            return{
                active:false,
                fs:require("fs"),
            }
        },
        methods:{
            clickActive(event){

                this.clearActive()

                let the = event.target
                let tag = the.tagName.toLowerCase()

                if( tag === 'li' ){
                    the.className += ' active'
                    this.activeBgBar( the.offsetHeight,the.offsetTop )
                }else if( tag === 'i' ){
                    the.parentNode.className += " active"
                }

                this.openfile()
            },
            openfile(){
                this.fs.readFile(this.file.path,(err,data)=>{
                    if(err){ return console.log(err) }
                    bus.$emit("get-file",{
                        text:data.toString(),
                        title:this.file.name,
                        path:this.file.path
                    })
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
            onFile(){
                let the = event.target
                if( the.tagName.toLowerCase() === 'i' ){
                    the = the.parentNode
                }
                this.activeBgBar( the.offsetHeight,the.offsetTop,'fileHoverBar' )
            },
            offfile(){
                this.activeBgBar( 0, 0 , 'fileHoverBar' )
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
    .file{
        z-index:99;
        padding:10px 10px;
        margin-bottom: 1px;
        font-size:14px;
        line-height:1;
        letter-spacing: 1px;
        color:#475669;
        user-select:none;
        cursor:default;
        white-space: nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
        position: relative;

        i{
            margin-right:1px;
        }
    }
    .file:hover,.file.active{
        color:#F9FAFC;
        background-color:#475669;
        cursor:default;
    }
</style>
