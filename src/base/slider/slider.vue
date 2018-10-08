<template>
    <div class="slider" ref="slider">
        <!-- 要通过Bsroll实现录播图，
        由于设置了overflow所以横向不能撑开，需要设计者sliderGroup的宽度 -->
        <div class="slider-group" ref="sliderGroup">
            <slot></slot>
        </div>
        <div class="dots">
            <span class="dot" ></span>
        </div>
    </div>
</template>
<script>
import BScroll from "better-scroll";
import { addClass } from "common/js/dom.js";
export default {
    props: {
        loop: {
            type: Boolean,
            default: true
        },
        autoPlay: {
            type: Boolean,
            default: true
        },
        interval: {
            type: Number,
            default: 3000
        }
    },
    //当数据被修改的时候去渲染better-scroll 是一个很好的选择，作者说的！！！
    mounted() {
        setTimeout(() => {
        /*选择20ms的原因是浏览器的刷新频率是16ms左右，稍微多一点是 一个经验值*/
            this._setSliderWidth();
            this._initSlider();
        }, 20);
    },
    methods: {
        _setSliderWidth() {
            //获取所有的子节点
            this.children = this.$refs.sliderGroup.children;
            let width = 0;
            //获取父级的视口高度，来作为轮播的宽度
            let sliderWidth = this.$refs.slider.clientWidth;
            for (let i = 0; i < this.children.length; i++) {
                let child = this.children[i];
                /*由于参数传递的时候不能直接把 .slider-item 直接传递 
                        这样耦合太强，在slider.vue 里面手动给节点加class
                        模块化思想，addClass可能还会复用，所以单独抽离一个模块，要用的时候直接用*/
                addClass(child, "slider-item");
                child.style.width = sliderWidth + "px";
                width += sliderWidth;
            }
            //当loop 为true 时，better-scroll 会克隆2个dom保证无缝轮播
            if (this.loop) {
                width += 2 * sliderWidth;
            }
            this.$refs.sliderGroup.style.width = width + "px";
        },
        _initSlider() {
            this.slider = new BScroll(this.$refs.slider, {
                scrollX: true,
                scrollY: false,
                momentum: false,
                snap: {
                    loop: this.loop,
                    threshold: 0.3,
                    speed: 400
                },
                //最新版写法更新了
                // snap: true,
                // snapLoop: this.loop,
                // snapThreshold: 0.3,
                // snapSpeed: 400,
                click: true
            });
        }
    }
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.slider {
    min-height: 1px;

    .slider-group {
        position: relative;
        overflow: hidden;
        white-space: nowrap;

        .slider-item {
            float: left;
            box-sizing: border-box;
            overflow: hidden;
            text-align: center;

            a {
                display: block;
                width: 100%;
                overflow: hidden;
                text-decoration: none;

                img {
                    display: block;
                    width: 100%;
                }
            }
        }
    }

    .dots {
        position: absolute;
        right: 0;
        left: 0;
        bottom: 12px;
        text-align: center;
        font-size: 0;

        .dot {
            display: inline-block;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: $color-text-l;

            &.active {
                width: 20px;
                border-radius: 5px;
                background: $color-text-ll;
            }
        }
    }
}
</style>
