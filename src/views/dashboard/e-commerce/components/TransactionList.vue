<script setup lang="ts">
import { DataListCard } from "@/components";
import { useNamespace } from "@/composables";

const ns = useNamespace();

const dataList = [
  {
    title: "新订单 #38291",
    status: "待处理",
    time: "5分钟",
    class: ns.join("bg-primary"),
    icon: "&#xe6f2;",
  },
  {
    title: "退款申请 #12845",
    status: "处理中",
    time: "10分钟",
    class: ns.join("bg-secondary"),
    icon: "&#xe806;",
  },
  {
    title: "客户投诉处理",
    status: "待处理",
    time: "15分钟",
    class: ns.join("bg-warning"),
    icon: "&#xe6fb;",
  },
  {
    title: "库存不足提醒",
    status: "紧急",
    time: "20分钟",
    class: ns.join("bg-danger"),
    icon: "&#xe813;",
  },
  {
    title: "订单 #29384 已发货",
    status: "已完成",
    time: "20分钟",
    class: ns.join("bg-success"),
    icon: "&#xe70c;",
  },
];

const handleMore = () => {};
</script>

<template>
  <DataListCard
    class="tk-card-minimal card"
    :maxCount="4"
    :list="dataList"
    title="最近活动"
    subtitle="订单处理状态"
    :showMoreButton="true"
    @more="handleMore"
  />
</template>
