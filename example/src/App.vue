<script setup lang="ts">
import axios from "axios";
import { ref, onMounted } from "vue";
let lists = ref([]);
let waterfall = ref<HTMLElement | null>();

const getLists = () => {
  axios
    .get("./src/mock/list.json" )
    .then((res) => {
      if (lists.value.length>100) {
       waterfall.value.onFinish();
        waterfall;
        return;
      }
      lists.value = lists.value.concat(res.data);
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
  <waterfall3
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
  </waterfall3>
</template>


<style scoped>
</style>
