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
        },
        listenScroll:{
            type:Boolean,
            default:false
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

            if(this.listenScroll){
                //保存vue实例
                let me = this
                //pos 为滚动位置， 有x轴，和Y轴的属性
                this.scroll.on('scroll', (pos) => {
                    //这里的this 为 scroll 的实例
                    me.$emit('scroll', pos)
                })
            }
        },
        enable() {
            this.scroll && this.scroll.enable()
        },
        disable() {
            this.scroll && this.scroll.disable()
        },
        refresh() {
            this.scroll && this.scroll.refresh()
        },
        /* 只所以要用apply 是因为， scrollTo会接受参数，
        通过apply把参数传递到 scroll实例的scrollTo方法里面 */
        scrollTo(){
            // scrollTo(x, y, time, easing) 滚动要指定的横纵坐标
            this.scroll && this.scroll.scrollTo.apply(this.scroll,arguments)
        },
        //原理同上
        scrollToElement(){
            //scrollToElement(el, time, offsetX, offsetY, easing) 滚动到指定元素， time为滚动时间
            this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
        }

    },
    wathch: {
        data (){
            setTimeout( () =>{
                this.refresh()
            },20)
        }
    }
}
</script>
