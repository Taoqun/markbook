<template lang="html">
    <div class="text-resource-wrap">
        <div class="text-title-list">
            <span class="title">{{title}}</span>
            <span class="path">{{path}}</span>
        </div>
        <div class="text-editer">
            <textarea v-model="text" @keydown="decideFile" ref="textRsc" @keyup="mkhtml"></textarea>
            <div class="markdown-body text-preview" v-html="html"></div>
        </div>
    </div>
</template>

<script>
    import { mapState } from "vuex"
    import hyperdown from "hyperdown"
    import fs from "fs"
    import bus from "@/bus"

    export default {
        data(){
            return{
                text:'',
                title:'',
                path:'',
                html:'',
                time: Date.now(),
                parse: new hyperdown(),
            }
        },
        computed:{

        },
        mounted(){
            this.listen()

        },
        methods:{
            listen(){
                bus.$on('get-file',({path,title,text})=>{
                    this.title = title
                    this.path = path
                    this.text = text
                })
                this.$electron.ipcRenderer.on("get-filePath",(event,res)=>{
                    this.path = res[0]
                    let list = res[0].split('/')
                    this.name = list[list.length-1]
                    this.saveFile()
                })
            },
            mkhtml(){
                this.preview()
            },
            preview(){
                this.html = this.parse.makeHtml(this.text)
            },
            decideFile(){
                if( event.keyCode === 83 && (event.ctrlKey || event.metaKey ) ){
                    this.saveFile()
                }
                if( event.keyCode === 9 ){
                    event.preventDefault()
                    let start = this.$refs.textRsc.selectionStart
                    let end = this.$refs.textRsc.selectionEnd
                    if( start === end ){
                        this.text = this.text.substring(0,start) +'        ' + this.text.substring(end)
                    }else{
                        this.text = this.text.substring(0,start) +'        ' + this.text.substring(start)
                    }
                    this.$nextTick(()=>{
                        if( start === end ){
                            this.$refs.textRsc.selectionStart = start + 8
                            this.$refs.textRsc.selectionEnd = end + 8
                        }else{
                            this.$refs.textRsc.selectionStart = start + 8
                            this.$refs.textRsc.selectionEnd = end + 8
                        }
                    })
                }
            },
            saveFile(){
                if( !this.path ){
                    this.$electron.ipcRenderer.send("save-file")
                    return
                }
                if( this.path.trim() ){
                    fs.writeFile(this.path,this.text,(err)=>{
                        if(err){
                            this.createFolder(this.path)
                            return
                        }
                        this.$notify({
                          title: '保存成功',
                          message: `${this.title}保存成功！`,
                          type: 'success',
                          duration:800,
                        });
                    })
                }
            },
            createFolder(path){

                let list = path.split('/')
                let file = list.pop()
                let folder = '/'

                list.map((str)=>{
                    folder += str + '/'
                })

                fs.mkdir(folder,(err)=>{
                    if (err) {return console.error(err)}
                    fs.writeFile(this.path,this.text,(err)=>{
                        if(err){
                            this.$notify({
                              title: '保存失败',
                              message: `${err}`,
                              type: 'error'
                            });
                            return console.log(err)
                        }
                        this.$notify({
                          title: '保存成功',
                          message: `${this.title}保存成功！`,
                          type: 'success',
                          duration:1000,
                        });
                    })
                })
            }
        },
    }
</script>

<style lang="scss">
    .text-resource-wrap{
        flex-grow:1;
        display: flex;
        flex-direction: column;
        max-width:80vw;
        border-left:1px solid #324057;

        .text-title-list{
            display: flex;
            min-height:35px;
            justify-content: space-between;
            background-color:#324057;
            span{
                font-size:14px;
                padding:10px;
                border-top-left-radius: 2px;
                border-top-right-radius: 2px;
                background-color: #324057;
                color:#fff;
            }
            .path{
                font-size:12px;
                line-height:1;
                letter-spacing: 1px;
                color:rgba(255,255,255,0.3);
            }
        }
        .text-editer{
            flex-grow:1;
            display: flex;
            max-width:100%;
        }
        .text-preview{
            font-size:14px;
            width:50%;
            max-width:50%;
            padding:20px;
            border-left:1px solid #ccc;
            overflow-y:auto;
        }
        textarea{
            width:50%;
            max-width:50%;
            border:none;
            padding:20px;
            font-size:16px;
            font-weight:100;
            line-height:1.5;
            overflow-y:auto;
        }
    }
</style>
