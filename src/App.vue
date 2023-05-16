<script setup lang="ts">
import  waterFall3  from "../core";
import axios from "axios";
import { ref, onMounted } from "vue";

let lists = ref([]);
let waterfall = ref<HTMLElement | null>();
let page =ref<number>(0)
const getLists = () => {
  axios
    .get("../mock/lists.json" )
    .then((res) => {
      // 加载到底部数据了
      if (page.value.length>10) {
       waterfall.value.onFinish();
        waterfall;
        return;
      }
      lists.value = lists.value.concat(res.data);
      page.value++
    });
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
