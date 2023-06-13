<script setup lang="ts">
import  waterFall3  from "../core";
import axios from "axios";
import { ref, onMounted } from "vue";


let mockLists=[
  {
    "src": "https://img-1301800639.cos.ap-guangzhou.myqcloud.com/waterfall/1.jfif"
  },
  {
    "src": "https://img-1301800639.cos.ap-guangzhou.myqcloud.com/waterfall/2.jfif"
  },
  {
    "src": "https://img-1301800639.cos.ap-guangzhou.myqcloud.com/waterfall/3.jfif"
  },
  {
    "src": "https://img-1301800639.cos.ap-guangzhou.myqcloud.com/waterfall/4.jfif"
  },
  {
    "src": "https://img-1301800639.cos.ap-guangzhou.myqcloud.com/waterfall/5.jfif"
  },
  {
    "src": "https://img-1301800639.cos.ap-guangzhou.myqcloud.com/waterfall/6.jfif"
  },
  {
    "src": "https://img-1301800639.cos.ap-guangzhou.myqcloud.com/waterfall/7.jfif"
  },
  {
    "src": "https://img-1301800639.cos.ap-guangzhou.myqcloud.com/waterfall/8.jfif"
  },
  {
    "src": "https://img-1301800639.cos.ap-guangzhou.myqcloud.com/waterfall/9.jfif"
  },
  {
    "src": "https://img-1301800639.cos.ap-guangzhou.myqcloud.com/waterfall/10.jfif"
  },
  {
    "src": "https://img-1301800639.cos.ap-guangzhou.myqcloud.com/waterfall/11.jfif"
  },
  {
    "src": "https://img-1301800639.cos.ap-guangzhou.myqcloud.com/waterfall/12.jfif"
  },
  {
    "src": "https://img-1301800639.cos.ap-guangzhou.myqcloud.com/waterfall/13.jfif"
  },
  {
    "src": "https://img-1301800639.cos.ap-guangzhou.myqcloud.com/waterfall/14.jfif"
  },
  {
    "src": "https://img-1301800639.cos.ap-guangzhou.myqcloud.com/waterfall/15.jfif"
  },
  {
    "src": "https://img-1301800639.cos.ap-guangzhou.myqcloud.com/waterfall/16.jfif"
  },
  {
    "src": "https://img-1301800639.cos.ap-guangzhou.myqcloud.com/waterfall/17.jfif"
  },
  {
    "src": "https://img-1301800639.cos.ap-guangzhou.myqcloud.com/waterfall/18.jfif"
  },
  {
    "src": "https://img-1301800639.cos.ap-guangzhou.myqcloud.com/waterfall/19.jfif"
  },
  {
    "src": "https://img-1301800639.cos.ap-guangzhou.myqcloud.com/waterfall/20.jfif"
  }
]

let lists = ref([]);
let waterfall = ref<HTMLElement | null>();
let page =ref<number>(0)
const getLists = () => {
       if (page.value.length>10) {
       waterfall.value.onFinish();
        waterfall;
        return;
      }
      lists.value = lists.value.concat(mockLists);
      page.value++
};

getLists();
const clickFn = ({ item,index,  isTapImg }) => {
  console.log(item,index,  isTapImg)
};

const imgErrorFn = (imgItem) => {
  console.log("图片加载错误", imgItem);
};
</script>

<template>
  <water-fall3
    ref="waterfall"
    :lists="lists"
    @onBottom="getLists"
    @click="clickFn"
    @imgError="imgErrorFn"
  >
    <!-- <template #default="props">
      <div class="img-info">
        <p class="some-info">第{{ props.index + 1 }}张图片</p>
        <p class="some-info">{{ props.value.info }}</p>
      </div>
    </template> -->
  </water-fall3>
</template>


<style scoped>
</style>
