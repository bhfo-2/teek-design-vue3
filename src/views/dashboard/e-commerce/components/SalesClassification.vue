<script setup lang="ts">
import { Money, Sell } from "@element-plus/icons-vue";
import { RingChart } from "@/components";
</script>

<template>
  <div class="tk-card-minimal card">
    <div class="card-header">
      <p class="title">销售分类</p>
      <p class="subtitle">按产品类别</p>
    </div>
    <RingChart
      :data="[
        { value: 30, name: '电子产品' },
        { value: 55, name: '服装鞋包' },
        { value: 36, name: '家居用品' },
      ]"
      :color="['#4C87F3', '#EDF2FF', '#8BD8FC']"
      :radius="['70%', '80%']"
      height="16.5rem"
      :showLabel="false"
      :borderRadius="0"
      centerText="¥300,458"
    />
    <div class="icon-text-widget">
      <div class="item">
        <div class="icon">
          <Icon :icon="Money" class="icon-sys" />
        </div>
        <div class="content">
          <p>¥500,458</p>
          <span>总收入</span>
        </div>
      </div>
      <div class="item">
        <div class="icon">
          <Icon :icon="Sell" class="icon-sys" />
        </div>
        <div class="content">
          <p>¥130,580</p>
          <span>净利润</span>
        </div>
      </div>
    </div>
  </div>
</template>
