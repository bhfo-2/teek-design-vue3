<script setup lang="ts">
import { TopRight } from "@element-plus/icons-vue";
import { LineChart } from "@/components";
import { useNamespace } from "@/composables";

const ns = useNamespace();
</script>

<template>
  <div class="tk-card-minimal card">
    <div class="card-header">
      <p class="title" style="font-size: 24px">
        12%
        <Icon :icon="TopRight" class="icon-sys" :class="ns.join('text-success')" />
      </p>
      <p class="subtitle">增长</p>
    </div>

    <LineChart
      :showAreaColor="true"
      :showAxisLabel="false"
      :showAxisLine="false"
      :showSplitLine="false"
      :data="[50, 85, 65, 95, 75, 130, 180]"
      barWidth="16px"
      height="4rem"
    />
  </div>
</template>
