<script setup lang="ts">
import type { UnwrapRef } from "vue";
import type { PageInfo } from "@/components/pro/pagination";
import type {
  OperationNamespace,
  ProTableHeadInstance,
  ProTableMainInstance,
  ProTableNamespace,
  TableColumn,
  SizeStyle,
  TableScope,
  TableRow,
} from "./types";
import { defaultPageInfo } from "@/components/pro/pagination";
import { filterEmpty } from "@/components/pro/form";
import { useNamespace } from "@/composables";
import { useTableApi, useTableState, type UseSelectState } from "./composables";
import { Environment, TableSizeEnum } from "./helper";
import TableMain from "./table-main.vue";
import TableHead from "./table-head.vue";

import "./styles/index.scss";

defineOptions({ name: "ProTable" });

const props = withDefaults(defineProps<ProTableNamespace.Props>(), {
  columns: () => [],
  data: () => [],
  requestApi: undefined,
  defaultRequestParams: () => ({}),
  requestParams: () => ({}),
  initRequestParams: () => ({}),
  requestImmediate: true,
  beforeSearch: undefined,
  requestError: undefined,
  dataCallback: undefined,
  hideHead: false,
  card: false,
  rowStyle: () => ({}),
  cellStyle: () => ({}),
  headerCellStyle: () => ({}),
  border: false,
  stripe: false,
  headerBackground: true,
  highlightCurrentRow: true,
  showHeader: true,

  // TableHead 组件的 props（透传下去）
  toolButton: () => ["size", "export", "columnSetting", "baseSetting"],
  disabledToolButton: () => [],
  size: () => TableSizeEnum.Default,
  title: "",
  exportProps: undefined,
  tooltipProps: () => ({ placement: "top", effect: "light" }),
  sizeStyle: () => ({}),
  columnSetting: () => ({}),
  baseSetting: () => ({}),
  isSelected: undefined,
  selectedList: undefined,
  selectedListIds: undefined,

  // TableMain 组件的 props（透传下去）
  operationProp: "operation",
  operationProps: () => ({}),
  pageInfo: () => defaultPageInfo,
  pageScope: false,
  paginationProps: () => ({}),
  radioProps: () => ({}),
  filterScope: false,
  editable: false,
  rowKey: "id",
  emptyText: "暂无数据",
});

const emits = defineEmits<ProTableNamespace.Emits>();

const ns = useNamespace("pro-table");
const tableHeadInstance = useTemplateRef<ProTableHeadInstance>("tableHeadInstance");
const tableMainInstance = useTemplateRef<ProTableMainInstance>("tableMainInstance");

// 表格密度
const tableSize = ref<TableSizeEnum>((props.size as TableSizeEnum) || TableSizeEnum.Default);
// 表格密度样式
const currentSizeStyle = ref<SizeStyle>();

// 最终的 props
const finalProps = computed(() => {
  const propsObj = {
    ...props,
    columns:
      isRef(props.columns) || isReactive(props.columns)
        ? props.columns
        : (reactive(unref(props.columns)) as TableColumn[]),
  };
  Object.assign(propsObj, mergeProps.value);
  return propsObj;
});

const { mergeProps, setProps, setColumn, addColumn, delColumn } = useTableApi(finalProps);

// 是否为服务器（后端）分页
const isServerPage = computed(() => {
  const { pageScope } = finalProps.value;

  // 如果传入 true，则为前端分页，返回 false
  if (!pageScope || pageScope === true) return false;
  return pageScope === Environment.Server;
});

const { tableData, pageInfo, searchParams, searchInitParams, getTableList, search, reset, handlePagination } =
  useTableState(
    finalProps.value.requestApi,
    computed(() => unref(finalProps.value.defaultRequestParams)),
    finalProps.value.pageInfo,
    isServerPage,
    finalProps.value.beforeSearch,
    finalProps.value.dataCallback,
    finalProps.value.requestError
  );

// 表格数据，传来的 data 大于 api 获取的数据
const finalTableData = computed(() => {
  const { data } = finalProps.value;
  if (data?.length) return data;
  return tableData.value;
});

// 表格全局设置
const baseSetting = reactive({
  border: finalProps.value.border,
  stripe: finalProps.value.stripe,
  showHeader: finalProps.value.showHeader,
  headerBackground: finalProps.value.headerBackground,
  highlightCurrentRow: finalProps.value.highlightCurrentRow,
  ...finalProps.value.baseSetting,
});

// 最终的 sizeStyle，即将 ProTable 内置的 sizeStyle 和传入的 sizeStyle 合并
const finalSizeStyle = computed(() => {
  const { rowStyle, cellStyle, headerCellStyle } = finalProps.value;
  return {
    rowStyle: { ...rowStyle, ...currentSizeStyle.value?.rowStyle },
    cellStyle: { ...cellStyle, ...currentSizeStyle.value?.cellStyle },
    headerCellStyle: {
      ...headerCellStyle,
      ...currentSizeStyle.value?.headerCellStyle,
      ...(!baseSetting.headerBackground && { backgroundColor: undefined }),
    },
  };
});

const tableMainProps = computed(() => {
  console.log(finalSizeStyle.value.headerCellStyle);
  // 过滤掉为 undefined 的配置项
  return filterEmpty({
    ...finalProps.value,
    // 去掉 TableHead 的配置项，确保所有的非 TableHead 的 props 都透传到 ElTable
    initRequestParams: undefined,
    defaultRequestParams: undefined,
    requestImmediate: undefined,
    hideHead: undefined,
    card: undefined,
    toolButton: undefined,
    disabledToolButton: undefined,
    size: undefined,
    title: undefined,
    exportProps: undefined,
    tooltipProps: undefined,
    sizeStyle: undefined,
    columnSetting: undefined,
    baseSetting: undefined,
    isSelected: undefined,
    selectedList: undefined,
    selectedListIds: undefined,
  });
});

watchEffect(() => (searchParams.value = finalProps.value.requestParams));
watchEffect(() => (searchInitParams.value = finalProps.value.initRequestParams));
watchEffect(() => (baseSetting.border = finalProps.value.border));
watchEffect(() => (baseSetting.stripe = finalProps.value.stripe));

onMounted(() => {
  // 初始化请求
  finalProps.value.requestImmediate && getTableList();
  // 注册实例
  emits("register", tableMainInstance.value?.$parent || null, tableMainInstance.value?.elTableInstance || null);
});

const handleSelectionChange = (useSelectReturn: UnwrapRef<UseSelectState>, index?: number) => {
  emits("selectionChange", useSelectReturn, index);
};

const handleRefresh = () => {
  getTableList();
  emits("refresh");
};

const handleSizeChange = (size: TableSizeEnum, style: SizeStyle) => {
  tableSize.value = size === TableSizeEnum.Mini ? TableSizeEnum.Default : size;
  currentSizeStyle.value = style;
  emits("sizeChange", size, style);
};

const handlePaginationChange = (pageInfo: PageInfo) => {
  handlePagination(pageInfo);
  emits("paginationChange", pageInfo);
};

const handleDragSortEnd = (newIndex: number, oldIndex: number) => {
  emits("dragSortEnd", newIndex, oldIndex);
};

/**
 * 执行过滤搜索
 */
const handleFilter = (filterModel: Recordable, filterValue: unknown, prop: string | undefined) => {
  emits("filter", filterModel, filterValue, prop);
};
/**
 * 执行过滤清除
 */
const handleFilterClear = (prop: string | undefined) => {
  emits("filterClear", prop);
};
/**
 * 执行过滤重置
 */
const handleFilterReset = () => {
  emits("filterReset");
};

const handleFormChange = (fromValue: unknown, prop: TableColumn["prop"], scope: TableScope) => {
  emits("formChange", fromValue, prop || "", scope);
};

const handleButtonClick = (params: OperationNamespace.ButtonsCallBackParams) => {
  emits("buttonClick", params);
};

const handleConfirm = (params: OperationNamespace.ButtonsCallBackParams) => {
  emits("confirm", params);
};

const handleCancel = (params: OperationNamespace.ButtonsCallBackParams) => {
  emits("cancel", params);
};

const handleLeaveCellEdit = (row: TableRow, column: TableColumn) => {
  emits("leaveCellEdit", row, column);
};

const getElTableInstance = () => tableMainInstance.value?.elTableInstance;
const getElFormInstance = () => tableMainInstance.value?.getElFormInstance;
const getElFormItemInstance = () => tableMainInstance.value?.getElFormItemInstance;
const getElInstance = () => tableMainInstance.value?.getElInstance;

const expose = {
  tableData,
  pageInfo,
  searchParams,
  searchInitParams,
  getTableList,
  search,
  reset,
  handlePagination,
  setProps,
  setColumn,
  addColumn,
  delColumn,

  getElTableInstance,
  getElFormInstance,
  getElFormItemInstance,
  getElInstance,
  tableHeadInstance,
  tableMainInstance,
};

defineExpose(expose);
</script>

<template>
  <div :class="[ns.b(), { 'tk-card': card }]">
    <!-- 表格头部 -->
    <TableHead
      v-if="!hideHead"
      ref="tableHeadInstance"
      :columns="finalProps.columns"
      :data="finalTableData"
      :tool-button="finalProps.toolButton"
      :disabled-tool-button="finalProps.disabledToolButton"
      :size="finalProps.size"
      :title="finalProps.title"
      :export-props="finalProps.exportProps"
      :tooltip-props="finalProps.tooltipProps"
      :size-style="finalProps.sizeStyle"
      :column-setting="finalProps.columnSetting"
      :base-setting
      :is-selected="tableMainInstance?.isSelected"
      :selected-list="tableMainInstance?.selectedList"
      :selected-list-ids="tableMainInstance?.selectedListIds"
      @refresh="handleRefresh"
      @size-change="handleSizeChange"
    >
      <template v-for="slot in Object.keys($slots)" #[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </TableHead>

    <!-- 表格主体 -->
    <TableMain
      ref="tableMainInstance"
      v-bind="{ ...$attrs, ...tableMainProps, ...finalSizeStyle, ...baseSetting }"
      :data="finalTableData"
      :page-info
      :size="tableSize"
      @button-click="handleButtonClick"
      @confirm="handleConfirm"
      @cancel="handleCancel"
      @selection-change="handleSelectionChange"
      @pagination-change="handlePaginationChange"
      @drag-sort-end="handleDragSortEnd"
      @form-change="handleFormChange"
      @filter="handleFilter"
      @filter-clear="handleFilterClear"
      @filter-reset="handleFilterReset"
      @leave-cell-edit="handleLeaveCellEdit"
    >
      <template v-for="slot in Object.keys($slots)" #[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </TableMain>
  </div>
</template>
