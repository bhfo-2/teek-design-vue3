<script setup lang="ts">
import type { TableColumn } from "@/components";
import type { FlowType } from "./index.vue";
import { ProTable } from "@/components";
import { myAgentData } from "./data/my-agent";
import { myApplyData } from "./data/my-apply";
import { myDoneData } from "./data/my-done";
import { myFollowData } from "./data/my-follow";

defineOptions({ name: "FlowTable" });

const props = defineProps<{
  type?: FlowType;
}>();

const data = ref<Recordable[]>([]);

watch(
  () => props.type,
  val => {
    if (val === "myAgent") data.value = myAgentData;
    else if (val === "myApply") data.value = myApplyData;
    else if (val === "myDone") data.value = myDoneData;
    else if (val === "myFollow") data.value = myFollowData;
    else data.value = [];
  },
  { immediate: true }
);

const columns: TableColumn[] = [
  { type: "index", label: "序号", width: 60 },
  { prop: "title", label: "任务标题", minWidth: 200 },
  { prop: "system", label: "所属系统", width: 100 },
  {
    prop: "status",
    label: "任务状态",
    width: 120,
    el: "el-tag",
    options: [
      { label: "审批中", value: "审批中", tagType: "info" },
      { label: "执行中", value: "执行中", tagType: "warning" },
    ],
    ignoreOptionIfAbsent: true,
  },
  { prop: "creator", label: "创建人", width: 100 },
  { prop: "createTime", label: "创建时间", width: 160 },
  { prop: "deadline", label: "任务期限", width: 120 },
];
</script>

<template>
  <ProTable :columns :data card page-scope :page-info="{ pageSize: 10 }" />
</template>
