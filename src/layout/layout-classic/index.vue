<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ElContainer, ElAside, ElHeader } from "element-plus";
import { useRouter } from "vue-router";
import SystemConfig, { HOME_URL } from "@/common/config";
import { useNamespace } from "@/composables";
import { useSettingStore } from "@/pinia";
import HeaderLeft from "../components/header/header-left.vue";
import PageContent from "../components/page-content/index.vue";
import Header from "../components/header/index.vue";
import Menu from "../components/menu/index.vue";

import "./index.scss";

defineOptions({ name: "LayoutClassic" });

const ns = useNamespace("classic-layout");
const router = useRouter();
const settingStore = useSettingStore();

const { isCollapse } = storeToRefs(settingStore);
</script>

<template>
  <!-- 布局：SideMenu 占屏幕左侧，Header 和 Main Content 占右侧 -->
  <el-container :class="[ns.join('layout'), ns.b(), ns.is('collapse', isCollapse), ns.is('expand', !isCollapse)]">
    <el-header :class="[ns.join('layout-header'), 'flx-align-center-between']">
      <Header>
        <template #left>
          <div :class="[ns.e('header-left'), 'flx-align-center']">
            <div :class="[ns.join('layout-logo'), 'flx-center']" @click="router.push(HOME_URL)">
              <img src="@/common/assets/images/logo.png" alt="logo" v-if="settingStore.showLayoutLogo" />
              <span v-show="!isCollapse">{{ SystemConfig.systemInfo.name }}</span>
            </div>
            <HeaderLeft />
          </div>
        </template>
      </Header>
    </el-header>

    <el-container :class="ns.e('content')">
      <el-aside :class="[ns.join('layout-aside'), ns.is(settingStore.menuTheme)]">
        <Menu
          :class="[ns.join('layout-menu'), ns.b('menu')]"
          :popper-class="`${ns.join('layout-menu-popper')} ${ns.b('menu-popper')}`"
        />
      </el-aside>

      <PageContent />
    </el-container>
  </el-container>
</template>
