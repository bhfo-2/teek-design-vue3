<script setup lang="ts">
import { ref } from "vue";
import { Check, Close } from "@element-plus/icons-vue";
import { useNamespace } from "@/composables";

defineOptions({ name: "Pricing" });

const ns = useNamespace("pricing");

interface Feature {
  text: string;
  available: boolean;
}

interface PricingPlan {
  type: string;
  title: string;
  description: string;
  price: number;
  isPopular: boolean;
  features: Feature[];
}

const pricingPlans = ref<PricingPlan[]>([
  {
    type: "single",
    title: "单次使用版",
    description: "适用于单个最终产品，最终用户无需付费。",
    price: 349,
    isPopular: false,
    features: [
      { text: "完整源代码", available: true },
      { text: "技术文档", available: true },
      { text: "SaaS应用授权", available: false },
      { text: "单个项目使用", available: true },
      { text: "一年技术支持", available: true },
      { text: "一年免费更新", available: true },
    ],
  },
  {
    type: "multiple",
    title: "多次使用版",
    description: "适用于无限个最终产品，最终用户无需付费。",
    price: 629,
    isPopular: false,
    features: [
      { text: "完整源代码", available: true },
      { text: "技术文档", available: true },
      { text: "SaaS应用授权", available: false },
      { text: "无限项目使用", available: true },
      { text: "一年技术支持", available: true },
      { text: "一年免费更新", available: true },
    ],
  },
  {
    type: "extended",
    title: "扩展授权版",
    description: "适用于单个最终产品，最终用户需要付费。",
    price: 2099,
    isPopular: false,
    features: [
      { text: "完整源代码", available: true },
      { text: "技术文档", available: true },
      { text: "SaaS应用授权", available: true },
      { text: "单个项目使用", available: true },
      { text: "一年技术支持", available: true },
      { text: "一年免费更新", available: true },
    ],
  },
  {
    type: "unlimited",
    title: "无限授权版",
    description: "适用于无限个最终产品，最终用户需要付费。",
    price: 3499,
    isPopular: false,
    features: [
      { text: "完整源代码", available: true },
      { text: "技术文档", available: true },
      { text: "SaaS应用授权", available: true },
      { text: "无限项目使用", available: true },
      { text: "一年技术支持", available: true },
      { text: "一年免费更新", available: true },
    ],
  },
]);
</script>

<template>
  <div :class="ns.b()">
    <div :class="ns.e('header')">
      <h1 class="title">超过 53,476 位信赖的开发者</h1>
      <h2 class="subtitle">以及众多科技巨头的选择</h2>
      <div :class="ns.e('free-notice')">
        <p class="notice-text">本项目基于 MIT 协议开源免费，当前页面为定价模板，仅作演示用途</p>
        <ElTag type="success" size="large" round>免费商用</ElTag>
      </div>
    </div>

    <div :class="ns.e('cards')">
      <el-row :gutter="20" justify="center">
        <el-col v-for="plan in pricingPlans" :key="plan.type" :xs="24" :sm="12" :md="6">
          <el-card :class="[ns.e('card'), ns.is('popular', plan.isPopular)]" shadow="never">
            <div :class="ns.e('card-header')">
              <h3>{{ plan.title }}</h3>
              <p class="description">{{ plan.description }}</p>
              <div class="price">
                <span class="amount">¥{{ plan.price }}</span>
                <span class="period">/一次性付款</span>
              </div>
            </div>

            <div :class="ns.e('features')">
              <div v-for="(feature, index) in plan.features" :key="index" class="feature-item">
                <el-icon :class="feature.available ? 'available' : 'unavailable'">
                  <Check v-if="feature.available" />
                  <Close v-else />
                </el-icon>
                <span>{{ feature.text }}</span>
              </div>
            </div>

            <div :class="ns.e('footer')">
              <el-button type="primary" class="purchase-btn" v-waves>立即购买</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;
@use "@styles/mixins/function" as *;

@include b(pricing) {
  padding: 2rem;
  background-color: transparent !important;
  border: none !important;

  @include e(header) {
    margin-bottom: 40px;
    text-align: center;

    .title {
      margin-bottom: 0.5rem;
      font-size: 2.5rem;
      font-weight: 500;
    }

    .subtitle {
      font-size: 1.4rem;
      font-weight: 400;
      color: #666666;
    }

    @include e(free-notice, true) {
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: center;
      margin-top: 10px;

      .notice-text {
        font-size: 14px;
        font-style: italic;
        color: var(--art-gray-600);
      }
    }
  }

  @include e(cards) {
    margin-top: 80px;

    .#{$el-namespace}-col {
      margin-bottom: 20px;
    }

    @include e(card, true) {
      display: flex;
      flex-direction: column;
      height: 100%;
      border-radius: 10px;

      @include is(popular) {
        position: relative;
        border: 2px solid cssVarEl(color-primary);

        &::after {
          position: absolute;
          top: 10px;
          right: 10px;
          padding: 2px 8px;
          font-size: 12px;
          color: cssVarEl(color-primary);
          content: "热门";
          background-color: cssVarEl(color-primary-light-9);
          border-radius: 12px;
        }
      }

      @include e(card-header, true) {
        margin-bottom: 20px;

        h3 {
          margin-bottom: 10px;
          font-size: 1.3rem;
          color: cssVar(text-gray-900) !important;
        }

        .description {
          display: -webkit-box;
          height: 40px;
          padding-bottom: 20px;
          margin-bottom: 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 14px;
          color: cssVar(text-gray-600);
          border-bottom: 1px solid cssVar(border-color);
          -webkit-box-orient: vertical;
        }

        .price {
          margin-top: 30px;

          .amount {
            font-size: 1.8rem;
            font-weight: 600;
          }

          .period {
            margin-left: 10px;
            font-size: 14px;
            color: cssVar(text-gray-600);
          }
        }
      }

      @include e(features) {
        flex-grow: 1;
        margin-bottom: 20px;

        .feature-item {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          font-size: 14px;

          .#{$el-namespace}-icon {
            margin-right: 10px;

            &.available {
              color: cssVarEl(color-primary);
            }

            &.unavailable {
              color: cssVarEl(color-danger);
            }
          }
        }
      }

      @include e(footer) {
        margin-top: auto;
        text-align: center;

        .purchase-btn {
          width: 100%;
          height: 40px;
        }
      }
    }
  }
}

@media only screen and (max-width: $device-notebook) {
  .pricing-container {
    padding: 5rem 2rem 0 !important;

    .pricing-cards {
      margin-top: 0;
    }
  }
}

@media only screen and (max-width: $device-phone) {
  .pricing-container {
    .pricing-header {
      .title {
        font-size: 2rem;
      }

      .subtitle {
        font-size: 1.5rem;
      }
    }

    .#{$el-namespace}-col {
      margin-bottom: 20px;
    }
  }
}
</style>
