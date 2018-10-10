<template>
    <div class="wrapper" ref="wrapper">
        <slot></slot>
    </div>
</template>
<script>
import BScroll from 'better-scroll'
export default {
    props: {
        //监听滚动事件，是缓慢滚动能监听，还是快速滚动监听到
        probeType:{
            type: Number,
            default: 1
        },
        //是否手动触发派发的点击事件
        click: {
            type: Boolean,
            default: true
        },
        data: {
            type: Array,
            default: null
        }
    },
    mounted(){
        setTimeout( () =>{
            this._initScroll()
        },20)
        
    },
    methods: {
        _initScroll(){
            if(!this.$refs.wrapper){
                return 
            }
            this.scroll = new BScroll(this.$refs.wrapper, {
                probeType: this.probeType,
                click: this.click
            })
        },
        enable() {
            this.scroll && this.scroll.enable()
        },
        disable() {
            this.scroll && this.scroll.disable()
        },
        refresh() {
            this.scroll && this.scroll.refresh()
        }

    },
    wathch: {
        data (){
            setTimeout( () =>{
                this.refresh
            },20)
        }
    }
}
</script>
