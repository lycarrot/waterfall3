<template>
  <div class="waterfall" :style="containerStyle">
    <div
      class="waterfall-loading ball-beat"
      v-show="isPreloading_c"
      :class="{ first: isFirstLoad }"
    >
      <slot name="loading" :isFirstLoad="isFirstLoad"></slot>
      <div v-if="!hasLoadingSlot">
        <div
          class="dot"
          v-for="n in loadingDotCount"
          :key="n"
          :style="loadingDotStyle"
        ></div>
      </div>
    </div>
    <div class="waterfall-scroll" ref="scrollEl">
      <slot name="head"></slot>
      <div
        class="waterfall-scroll__content"
        :style="
          isMobile
            ? ''
            : {
                width: colWidth * cols + 'px',
                left: '50%',
                marginLeft: (-1 * colWidth * cols) / 2 + 'px',
              }
        "
      >
        <div
          class="list"
          v-for="(item, i) in preLoadLists"
          :key="i"
          :class="[cardAnimationClass, { __err__: item._error }]"
          :style="{
            padding: horizontalGap/ 2 + 'px',
            width: isMobile ? '' : colWidth + 'px',
          }"
          @click.stop="toItem(item, i)"
        >
          <img
            :src="item[srcKey]"
            v-if="item[srcKey]"
            @click.stop="toItem(item, i, true)"
          />
          <slot :index="i" :item="item"></slot>
        </div>
        <div class="finish" v-if="isFinish" ref="finishEl">
          <slot name="finish">到底部了</slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "waterFall3",
};
</script> 
<script lang="ts" setup>
interface Item {
  _height?: number;
}

import {
  ref,
  computed,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  watch,
  nextTick,
  useSlots,
} from "vue";
const props = defineProps({
  // 容器宽度
  width: {
    type: Number,
  },
  // 容器高度
  height: {
    type: Number,
  },
  // 列表数据
  lists: {
    type: Array,
    required: true,
    default: [],
  },
  itemWidth: {
    type: Number,
    default: 240,
  },
  // 滚动条与底部距离小于 bottomOffset 时触发新的加载
  bottomOffset: {
    type: Number,
    default: 50,
  },
  maxCols: {
    type: Number,
    default: 5,
  },
  //水平列表项之间的间距
  horizontalGap: {
    type: Number,
    default: 10,
  },
  //纵向列表项之间的间距
  verticalGap: {
    type: Number,
    default: 20,
  },
  srcKey: {
    type: String,
    default: "src",
  },
  loadingDotCount: {
    type: Number,
    default: 3,
  },
  loadingDotStyle: {
    type: Object,
  },
  loadingTimeOut: {
    type: Number,
    default: 500,
  },
  cardAnimationClass: {
    type: [String],
    default: "default-card-animation",
  },
  enablePullDownEvent: {
    type: Boolean,
    default: false,
  },
  finishGap:{
    type: Number,
    default: 20,
  }
});
const emit = defineEmits([
  "onBottom",
  "click",
  "imgError",
  "pullDownMove",
  "pullDownEnd",
]);
const slots = useSlots();

const isMobile: boolean = !!navigator.userAgent.match(
  /(iPhone|iPod|Android|ios)/i
);
let isPreloading = ref<boolean>(true);
let isPreloading_c = ref<boolean>(true);
let preLoadLists = ref<any[]>([]);
let loadedCount = ref<number>(0);
let cols = ref<number>(0);
let newLists = ref();
let beginIndex = ref<number>(0);
let colsHeightArr = ref<any[]>([]);
let LoadingTimer = ref(null);
let isFirstLoad = ref<boolean>(true);
let isFinish = ref<boolean>(false);
let scrollEl = ref<HTMLElement>();
let finishEl = ref<HTMLElement>();

const colWidth = computed(() => {
  return props.itemWidth + props.horizontalGap;
});
const newItemWidth = computed(() => {
  return isMobile ? window.innerWidth / 2 - props.horizontalGap : props.itemWidth;
});
const hasLoadingSlot = computed(() => {
  return !!slots.loading;
});
const containerStyle = computed(() => {
  width: props.width + "px";
  height: props.height + "px";
});


const preloaded = () => {
  isFirstLoad.value = false;
  preLoadLists.value = (props.lists as Item[]).concat([]);
  nextTick(() => {
    isPreloading.value = false;
    newLists.value = (scrollEl.value as HTMLElement).getElementsByClassName(
      "list"
    ) as HTMLCollectionOf<HTMLElement>;
    startLayout();
  });
};

const onPreload = () => {
  props.lists.forEach((item: any, index: number) => {
    if (index < loadedCount.value) return;
    if (!item[props.srcKey]) {
      item._height = "0";
      loadedCount.value++;
      if (loadedCount.value == props.lists.length) {
        preloaded();
      }
      return;
    }
    const oImg = new Image();
    oImg.src = item[props.srcKey];
    oImg.onload = (e: Event) => {
      loadedCount.value++;
      item._height =
        e.type == "load"
          ? Math.round(newItemWidth.value / (oImg.width / oImg.height))
          : isMobile
          ? newItemWidth.value
          : props.itemWidth;
      if (loadedCount.value == props.lists.length) {
        preloaded();
      }
    };
    oImg.onerror = () => {
      loadedCount.value++;
      item._error = true;
      emit("imgError", props.lists[index]);
    };
  });
};

const calcuCols = () => {
  const waterfallWidth =
    (props.width ? props.width : window.innerWidth) / colWidth.value;
  let cols = parseInt(waterfallWidth.toString());
  cols = cols === 0 ? 1 : cols;
  return isMobile ? 2 : cols > props.maxCols ? props.maxCols : cols;
};


const startLayout = () => {
  const lists = newLists.value;
  if (!lists || !lists.length) return;
  let top, left, height;
  let width: number = isMobile ? lists[0].offsetWidth : colWidth.value;
  if (beginIndex.value == 0) colsHeightArr.value = [];
  for (let i = beginIndex.value; i < props.lists.length; i++) {
    const item = lists[i];
    if (!item) return;
    height =(props.lists[i] as Item)._height
    if (i < cols.value) {
      colsHeightArr.value.push(height);
      top = 0;
      left = i * width;
    } else {
      let minHeight = Math.min.apply(null, colsHeightArr.value); 
      let minIndex = colsHeightArr.value.indexOf(minHeight); 
      top = minHeight+props.verticalGap;
      left = minIndex * width;
      colsHeightArr.value[minIndex] = minHeight +props.verticalGap+ height;
    }
    item.style.left = left + "px";
    item.style.top = top + "px";
  }
  beginIndex.value = props.lists.length; 
};


const response = () => {
  let old = cols.value;
  cols.value = calcuCols();
  if (old === cols.value) return; 
  beginIndex.value = 0; 
  startLayout();
  if (isFinish.value) setFinishTipPos();
};

const scrollFn = () => {
  const el = scrollEl.value;
  if (isPreloading.value) return;
  let minHeight = Math.min.apply(null, colsHeightArr.value);
  if (el && el.scrollTop + el.offsetHeight > minHeight - props.bottomOffset) {
    isPreloading.value = true;
    emit("onBottom"); 
  }
};
const onScroll = () => {
  const el = scrollEl.value as HTMLElement;
  el.addEventListener("scroll", scrollFn);
};
const onFinish = () => {
  const el = scrollEl.value as HTMLElement;
  el.removeEventListener("scroll", scrollFn);
  isPreloading.value = false;
  isFinish.value = true;
  setFinishTipPos();
};

const setFinishTipPos = () => {
  let maxHeight = Math.max.apply(null, colsHeightArr.value);
  nextTick(() => {
    (finishEl.value as HTMLElement).style.top = maxHeight + props.finishGap+ "px";
  });
};


const pullDown = () => {
  const el = scrollEl.value as HTMLElement;
  let startY: any;
  el.addEventListener("touchmove", (e: TouchEvent) => {
    if (el.scrollTop === 0) {
      let t = e.changedTouches[0];
      if (!startY) startY = t.pageY;
      let pullDownDistance = t.pageY - startY;
      if (pullDownDistance > 0) {
        e.preventDefault();
      }
      emit("pullDownMove", pullDownDistance);
    }
  });
  el.addEventListener("touchend", (e) => {
    if (el.scrollTop === 0) {
      startY = NaN;
      emit("pullDownEnd");
    }
  });
};

const loadingMiddle = () => {
  let scrollEl = document.querySelector(".waterfall-scroll") as HTMLElement;
  let scrollbarWidth = scrollEl.offsetWidth - scrollEl.clientWidth;
  const loadIngEl = document.querySelector(".waterfall-loading") as HTMLElement;
  loadIngEl.style.marginLeft = -scrollbarWidth / 2 + "px";
};

const onReset = () => {
  preLoadLists.value = [];
  beginIndex.value = 0;
  loadedCount.value = 0;
  isFirstLoad.value = true;
  isPreloading.value = true;
  onScroll();
  isFinish.value = false;
};


const toItem = (item, index, isTapImg=false) => {
  emit("click", { item, index, isTapImg });
};
watch(isPreloading, (newV) => {
  if (newV) {
    setTimeout(() => {
      if (!isPreloading.value) return; 
      isPreloading_c.value = true;
    }, props.loadingTimeOut);
  } else {
    isPreloading_c.value = false;
  }
});
watch(
  (): Item[] => props.lists as Item[],
  (newV) => {
    if (
      preLoadLists.value.length > newV.length ||
      (preLoadLists.value.length > 0 && newV[0] && !newV[0]._height)
    ) {
      onReset();
    }
    onPreload();
  }
);
onMounted(() => {
  loadingMiddle();
  onPreload();
  cols.value = calcuCols();
  if (!isMobile && !props.width) window.addEventListener("resize", response);
  if (isMobile && props.enablePullDownEvent) pullDown();
  onScroll();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", response);
});

defineExpose({
  onFinish
});
</script>
<style  lang="less" scoped>
.waterfall {
  width: 100%;
  height: 100%;
  position: relative;
  &-scroll {
    position: relative;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    &__content {
      position: absolute;
      width: 100%;
      @keyframes show-card {
        0% {
          transform: scale(0.5);
        }
        100% {
          transform: scale(1);
        }
      }
      & > .list {
        position: absolute;
        box-sizing: border-box;
        width: 50%;
        img{
          width: 100%;
        }
      }
      & > .list.default-card-animation {
        animation: show-card 0.4s;
        transition: left 0.6s, top 0.6s;
        transition-delay: 0.1s;
      }

      .finish {
        position: absolute;
        width: 100%;
        text-align: center;
        font-size: 16px;
        line-height: 1.6;
        color: #aaa;
      }
    }
  }

  & > .loading.first {
    bottom: 50%;
    transform: translate(-50%, 50%);
  }
  & > .loading {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 6px;
    z-index: 999;
    @keyframes ball-beat {
      50% {
        opacity: 0.2;
        transform: scale(0.75);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }

    &.ball-beat > .dot {
      vertical-align: bottom;
      background-color: #4b15ab;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin: 3px;
      animation-fill-mode: both;
      display: inline-block;
      animation: ball-beat 0.7s 0s infinite linear;
    }
    &.ball-beat > .dot:nth-child(2n-1) {
      animation-delay: 0.35s;
    }
  }
}
</style>