# waterFall3 瀑布流组件

### 介绍
基于vue3+typesscript+rollup构建的瀑布流列表组件，在pc端能够根据屏幕宽度做自适应变化调整。

### 效果查看地址
[http://waterfall3.top/](http://139.9.217.126/)

### 安装
```
npm i water-fall3 --save-dev 
或
yarn install water-fall3 --save-dev
```

### 引入
全局注册组件

```js
import { createApp } from 'vue';
import waterFall3 from 'water-fall3';

const app = createApp();
app.use(waterFall3);
```

局部注册组件
```js
<script setup lang="ts">
import  waterFall3  from "../../src/";
</script>
<template>
<water-fall3></water-fall3> 
</template>
```


## 代码演示

### 基础用法
```html
  <water-fall3
    ref="waterfall"
    :lists="lists"
    @onBottom="getLists"
    @click="clickFn"
    @imgError="imgErrorFn"
  >
  </water-fall3>
```
```js
<script setup lang="ts">
import  waterFall3  from "../../src/";
import axios from "axios";
import { ref, onMounted } from "vue";
let lists = ref([]);
let waterfall = ref<HTMLElement | null>();
let page =ref<number>(0)
const getLists = () => {
  axios
    .get("./src/mock/list.json" )
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
```

## API


### CouponList Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| width | 容器宽度 | _number_ | - |
| height | 容器高度 | _number_ | - |
| lists | 列表数据 | _array_ | [] |
| itemWidth | 每一项列表的宽度 | _number_ | 240 |
| bottomOffset | 滚动条与底部距离小于 bottomOffset 时触发新的加载 | _number_ | 50 |
| maxCols | 在当前容器宽度内最多可以容纳多少列 | _number_ | 5 |
| horizontalGap | 水平列表项之间的间距 | _number_ | 10 |
| verticalGap | 纵向列表项之间的间距 | _number_ | 10 |
| srcKey | 列表项显示图片的key字段 | _string_ | src |
| offsetBottom | 列表项显示图片的key字段 | _string_ | src |
| srcKey | 列表项显示图片的key字段 | _string_ | src |
| finishGap | 列表和滚动到底部文字距离 | _number_ | 20 |



###  Events

| 事件名   | 说明           | 回调参数                |
| -------- | -------------- | ----------------------- |
| onBottom   | 与底部距离小于 bottomOffset 时触发该事件 | - |
| click | 点击列表项触发 | item:列表数据;index:列表项:isTapImg:点击的是图片还是整个列表项;           |

### Slots

| 名称                           | 说明                 |
| ------------------------------ | -------------------- |
| loading       | 加载数据动画       |
| head | 列表头部项内容 |
| default | 列表项默认描述内容 |
| finish | 列表项底部描述尼尔 |

