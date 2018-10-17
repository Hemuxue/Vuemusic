<template>
    <scroll class="listview" 
            :data="data"  
            ref="listview"
            :listenScroll="listenScroll"
            :probe-type="probeType"
            @scroll="scroll" 
    >
        <ul>
            <li v-for="group in data" 
                class="list-group" 
                ref="listGroup">
                <h2 class="list-group-title">{{group.title}}</h2>
                <ul>
                    <li v-for="item in group.items" class="list-group-item">
                        <img class="avatar" v-lazy="item.avatar" >
                        <span class="name">{{item.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="list-shortcut"
        @touchstart="onShortcutTouchStart"
        @touchmove.stop.prevent="onShortcutTouchMove"> 
            <ul>
                <li v-for="(item,index) in shortcutList" 
                class="item"
                :class=" {current: currentIndex === index} " :data-index="index">
                    {{item}}
                </li>
            </ul>
        </div>
        <div class="list-fixed" v-show="fixedTitle" ref="fixed">
            <h1 class="fixed-title">{{fixedTitle}}</h1>
        </div> 
        <div v-show="!data.length" class="loading-container">
            <loading></loading>
        </div>   
    </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {getData} from 'common/js/dom'

//右边锚点的高度
const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT  = 30


export default {
    /* 不在 data里面定义touch的原因，因为在vue中，props，data，computed
    里面的属性，都会加一个getter 和setter来监听，以便于对页面做响应
    而我们只是想要一个 对象来存储touch的值，不需要监听， */
    created(){
        //用来记录Start，Move事件触发 相关数据
        this.touch = {}
        this.listenScroll = true
        //想scroll组件传值，表示不节流，并监听scroll事件
        this.probeType = 3
        //记录每一个group的高度
        this.listHeight = []
    },
    data() {
        return {
            scrollY: -1 ,
            currentIndex: 0,
            //diff 为正在滚动的视口 title 与滚动区域顶部的高度差
            diff: -1
        }
    },
    props:{
        data:{
            type:Array,
            default:[]
        }
    },
    computed:{
        //获取 每个 的title
        shortcutList() {
            return this.data.map((group) =>{
                return group.title.substr(0,1)
            })
        },
        fixedTitle() {
            //没滚动，或者滚动到上部边界时，隐藏fixedTitle
            if(this.scrollY >= 0){
                return
            }
            return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
        }
    },
    methods:{
        onShortcutTouchStart(e){
            /* 整体思路，通过 getData 获取点击的字母类别的index值
            再通过scroll 里面封装的scrollToElement 来跳转到 listGroup对应的index值的 区域 */
            let anchorIndex = getData(e.target,'index')
            //e.touches[0] 记录了第一次点击的各种信息
            let firshTouch = e.touches[0]

            //记录第一次点击是 pageY的值
            this.touch.y1 = firshTouch.pageY
            //记录一开始点的时候的索引
            this.touch.anchorIndex = anchorIndex
            this._scrollTo(anchorIndex)
        },
        /* 实现拖动的思路，当 Start触发时，记录点击的索引，和pageY的值
        当触发move事件时，计算move时，e.touches[0].pageY 的值跟start的值来做计算
        得出 间隔 delta 个字母，再通过与 一开始点的索引相加，得出需要渲染的新的索引位置
         */
        onShortcutTouchMove(e){
            setTimeout( ()=>{
                let firshTouch = e.touches[0]
                this.touch.y2 = firshTouch.pageY
                // | 0 相当于Math.floor   但是这些使用Math.round 更加准确一点
                // let delta =  (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT  | 1
                let delta = Math.round( (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT ) 
                let anchorIndex = +this.touch.anchorIndex + delta
                this._scrollTo(anchorIndex)
                
            },16)
        },
        scroll(pos){
            this.scrollY = pos.y
        },
        _scrollTo(index){

            /*由于touch事件绑定在父级上面的，所以如果没有点击到 li上，
            index为 null会有 问题，所以需要专门处理下。 */
            if(!index && index !== 0 ){
                return 
            }
            if(index < 0){
                index = 0
            }else if (index > this.listHeight.length - 2){
                index = this.listHeight.length - 2
            }
            //把上限的位置传递给scrollY，引发页面滚动，来实现右边的点击有高量
            this.scrollY = -this.listHeight[index]
            this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
        },
        //计算每个group的高度
        _calculateHeight(){
            this.listHeight = []
            const list = this.$refs.listGroup
            let height = 0
            this.listHeight.push(height)
            for(let i = 0 ;i < list.length ; i++){
                let item = list[i]
                height += item.clientHeight
                this.listHeight.push(height)
            }
        }
        
    },
    watch:{
        data() {
            setTimeout( ()=>{
                this._calculateHeight()
            },20)
        },
        scrollY(newY) {
            const listHeight = this.listHeight
            //当滚动到顶部，newY > 0 
            if(newY > 0) {
                this.currentIndex = 0
                return 
            }
            //在中间部门滚动 listHeight.length 比 listGroup 多一个需要少遍历一个
            for(let i = 0; i < listHeight.length - 1 ; i++) {
                let heightLow = listHeight[i] //下限
                let heightTop = listHeight[i + 1 ] //上限
                //当往上滚动时， newY为负值,而我们计算的是正值，所以取正
                if(-newY >= heightLow && -newY < heightTop) {
                    this.currentIndex = i
                    /*由于newY 是负值，实际是减。由前一个上限（也是当前的下限）来减去滚动的距离
                    计算出 diff  */
                    this.diff = heightTop + newY
                    return 
                }
            }
            // 当滚动带底部，且 -newY 大于最后一个元素的上限
            this.currentIndex = listHeight - 2 
        },
        diff(newVal){
            /*diff实际作用的区域为，当前的下限要与 fixedTitle发现重合的时候 
            其他时候都为0 ，经过一次this.fixed = fixedTop 之后，当fixedTop为 不变时
            直接return 不做多余的计算
            当fixed变化时，贼做fixed这么多的偏移量，就有一种被碰撞的动效*/
            let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT ) ? newVal - TITLE_HEIGHT : 0
            
            if(this.fixedTop === fixedTop){
                return
            }
            this.fixedTop = fixedTop
            this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
        }
    },
    components:{
        Scroll,
        Loading
    },
    
}
</script>
<style lang="stylus" scoped>
@import "~common/stylus/variable"
    .listview
        position fixed
        top 88px
        bottom 0
        width 100%
        overflow hidden
        background: $color-background
        .list-group
            padding-bottom: 30px
            .list-group-title
                height: 30px
                line-height: 30px
                padding-left: 20px
                font-size: $font-size-small
                color: $color-text-l
                background: $color-highlight-background
            .list-group-item
                display: flex
                align-items: center
                padding: 20px 0 0 30px
                .avatar
                    width: 50px
                    height: 50px
                    border-radius: 50%
                .name
                    margin-left: 20px
                    color: $color-text-l
                    font-size: $font-size-medium
        .list-shortcut
            position absolute
            z-index 30
            right 0
            top 50%
            transform translateY(-50%)
            width 20px
            padding 20px 0
            border-radius  10px
            text-align center
            background $color-background-d
            font-family Helvetica
            .item
                padding 3px
                line-height 1
                color $color-text-1
                font-size $font-size-small
                &.current
                    color $color-theme
        .list-fixed
            position absolute
            top 0
            left 0 
            width 100%
            .fixed-title
                height: 30px
                line-height: 30px
                padding-left: 20px
                font-size: $font-size-small
                color: $color-text-l
                background: $color-highlight-background
        .loading-container
            position: absolute
            width: 100%
            top: 50%
            transform: translateY(-50%)

</style>
