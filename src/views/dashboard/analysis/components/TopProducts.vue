<script setup lang="ts">
import { hexToRgb } from "@/common/utils";

const products = computed(() => [
  {
    name: "智能手机",
    popularity: 10,
    sales: "100",
  },
  {
    name: "笔记本电脑",
    popularity: 29,
    sales: "100",
  },
  {
    name: "平板电脑",
    popularity: 65,
    sales: "100",
  },
  {
    name: "智能手表",
    popularity: 32,
    sales: "100",
  },
  {
    name: "无线耳机",
    popularity: 78,
    sales: "100",
  },
  {
    name: "智能音箱",
    popularity: 41,
    sales: "100",
  },
]);

const getColor = (percentage: number) => {
  if (percentage < 25) return "#00E096";
  if (percentage < 50) return "#0095FF";
  if (percentage < 75) return "#884CFF";
  return "#FE8F0E";
};
</script>

<template>
  <div class="tk-card-minimal card top-products">
    <div class="card-header">
      <span class="title">热门产品</span>
    </div>
    <div class="card-body no-padding">
      <el-table :data="products" style="width: 100%" size="large">
        <el-table-column prop="name" label="产品名称" width="200" />
        <el-table-column prop="popularity" label="销量">
          <template #default="scope">
            <el-progress
              :percentage="scope.row.popularity"
              :color="getColor(scope.row.popularity)"
              :stroke-width="5"
              :show-text="false"
            />
          </template>
        </el-table-column>
        <el-table-column prop="sales" label="销量" width="80">
          <template #default="scope">
            <span
              :style="{
                color: getColor(scope.row.popularity),
                backgroundColor: `rgba(${hexToRgb(getColor(scope.row.popularity))}, 0.08)`,
                border: '1px solid',
                padding: '3px 6px',
                borderRadius: '4px',
                fontSize: '12px',
              }"
            >
              {{ scope.row.sales }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
