<script setup lang="ts">
import type { Component } from "vue";
import { computed, ref, nextTick, provide, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { ElMain } from "element-plus";
import { RefreshPageKey } from "@/config";
import { getUrlParams, mittBus } from "@/utils";
import { useLayoutStore, useSettingStore } from "@/stores";
import { TabNavModeEnum } from "@/enums/appEnum";
import SimpleTabNav from "../tab-nav/tab-nav-simple/index.vue";
import ClassicTabNav from "../tab-nav/tab-nav-classic/index.vue";
import ElTabNav from "../tab-nav/tab-nav-element/index.vue";
import Maximize from "./components/maximize.vue";
import FrameLayout from "../iframe/index.vue";

defineOptions({ name: "MainContent" });

const layoutStore = useLayoutStore();
const settingStore = useSettingStore();

const { tabNavMode, showTabNav } = storeToRefs(settingStore);

const TabNavComponents: Record<string, Component> = {
  [TabNavModeEnum.Simple]: SimpleTabNav,
  [TabNavModeEnum.Classic]: ClassicTabNav,
  [TabNavModeEnum.Element]: ElTabNav,
};

// 刷新当前页面
const isRefreshRoute = ref(true);
const refreshCurrentPage = (value?: boolean) => {
  if (value !== undefined) isRefreshRoute.value = value;
  isRefreshRoute.value = false;

  nextTick(() => {
    isRefreshRoute.value = true;
  });
};
provide(RefreshPageKey, refreshCurrentPage);

mittBus.on(RefreshPageKey, () => refreshCurrentPage());

// 监听当前页是否最大化，动态添加 class
watchEffect(() => {
  const urlParams = getUrlParams();
  const app = document.getElementById("app") as HTMLElement;

  if (urlParams.get("_maximize")) {
    if (!app?.className.includes("page-maximize")) app?.classList.add("page-maximize");
  } else {
    if (settingStore.maximize) app?.classList.add("page-maximize");
    else app?.classList.remove("page-maximize");
  }
});

const isFixTabNav = computed(() => {
  if (settingStore.fixTabNav) return "auto";
  return "";
});
</script>

<template>
  <Maximize v-if="settingStore.maximize" />
  <el-main class="flx-column">
    <component :is="TabNavComponents[tabNavMode]" v-if="showTabNav" />

    <router-view v-slot="{ Component, route }">
      <transition :name="settingStore.pageTransition" mode="out-in" appear>
        <div class="page-content">
          <keep-alive :max="10" :include="layoutStore.keepAliveName">
            <component v-if="isRefreshRoute" :is="Component" :key="route.path" />
          </keep-alive>
        </div>
      </transition>
    </router-view>
    <FrameLayout />
  </el-main>
</template>

<style lang="scss" scoped>
.#{$el-namespace}-main {
  padding: 0;
  background-color: var(--#{$admin-namespace}-bg-color);

  .page-content {
    max-height: calc(
      100vh - var(--#{$admin-namespace}-layout-header-height) - var(--#{$admin-namespace}-layout-tab-height) - 18px
    );
    margin: 10px 12px;
    overflow: v-bind(isFixTabNav);
  }
}
</style>

<style lang="scss">
/* 当前页面最大化 */
.page-maximize {
  .#{$admin-namespace}-columns-layout__aside,
  .#{$el-namespace}-aside,
  .#{$el-namespace}-header,
  .#{$el-namespace}-footer,
  .tab-nav {
    display: none !important;
  }
}
</style>
