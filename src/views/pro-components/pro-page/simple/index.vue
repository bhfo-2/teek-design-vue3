<script setup lang="ts">
import type { OperationNamespace, TableColumn } from "@components/pro/table";
import type { PageColumn } from "@components/pro/page";
import { ProPage } from "@components/pro/page";
import { tableData } from "@/mock/pro-table";
import { Edit, Delete } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

defineOptions({ name: "Test" });

const getTicketList = (searchParams: Recordable) => {
  console.log("搜索参数 ", searchParams);

  return new Promise(resolve => {
    resolve({ data: tableData });
  });
};

const columns: PageColumn[] = [
  { type: "selection", fixed: "left", width: 60 },
  { type: "index", label: "#", width: 60 },
  { type: "sort", label: "Sort", width: 80 },
  { type: "expand", label: "Expand", width: 80 },
  {
    prop: "username",
    label: "用户姓名",
    search: {
      el: "el-input",
      beforeSearch: (searchValue, searchParams, column) => {
        return `#${searchValue}`;
      },
    },
  },
  {
    prop: "gender",
    label: "性别",
    search: { el: "el-select" },
    el: "el-tag",
    options: async () => {
      return [
        { label: "男", value: 1 },
        { label: "女", value: 2 },
      ];
    },
  },
  {
    // 多级 prop
    prop: "user.detail.age",
    label: "年龄",
    el: "el-progress",
    elSlots: {
      default: ({ value }) => "*" + value,
    },
    filter: true,
    disabledFilter: false,
    filterProps: { formColumn: { elProps: { modelModifiers: { number: true } } } },
  },
  {
    prop: "idCard",
    label: "身份证号",
    formatValue: value => (value as string)?.replace(/\d{4}/, "****"),
    filter: true,
    filterProps: { rule: "like" },
    search: { el: "el-input" },
    editProps: {
      formItemProps: {
        required: true,
      },
    },
  },
  { prop: "email", label: "邮箱", search: { el: "el-input" } },
  { prop: "address", label: "居住地址" },
];

const el = ref<OperationNamespace.Props["el"]>("ElIcon");
const buttons = ref<OperationNamespace.ButtonRaw[]>();

buttons.value = [
  {
    text: "修改",
    code: "edit",
    elProps: () => ({
      type: "primary",
    }),
    icon: Edit,
    show: row => !row._editable,
    onClick: async ({ row }) => {
      row._editable = !row._editable;
    },
  },
  {
    text: "保存",
    code: "save",
    elProps: () => ({
      type: "primary",
    }),
    show: row => !!row._editable,
    icon: Edit,
    onClick: async ({ row }) => {
      const valid = await row._validateCellEdit();
      if (valid) row._editable = !row._editable;
    },
  },
  {
    text: "删除",
    code: "delete",
    elProps: computed(() => ({ type: "danger" })),
    confirm: {
      el: "ElMessageBox",
      props: { options: { draggable: true } },
    },
    icon: Delete,
  },
];

const handleFormChange = async (fromValue: unknown, prop: string, scope: Recordable) => {
  // setProp(data.value[scope.rowIndex], prop, fromValue);
};

const handleLeaveCellEdit = (row: Recordable, column: TableColumn) => {
  ElMessage.success("退出编辑");
};

const handleButtonClick = (params: OperationNamespace.ButtonsCallBackParams) => {
  console.log("buttonClick", params);
};

const handleConfirm = (params: OperationNamespace.ButtonsCallBackParams) => {
  console.log("confirm", params);
};

const handleCancel = (params: OperationNamespace.ButtonsCallBackParams) => {
  console.log("cancel", params);
};
</script>

<template>
  <ProPage
    :columns
    :request-api="getTicketList"
    page-scope
    card
    :search-props="{
      searchCols: { xs: 1, sm: 1, md: 2, lg: 4, xl: 4 },
    }"
    editable="click"
    :operation-props="{
      buttons: buttons,
      el,
      width: el === 'ElButton' ? 260 : el === 'ElIcon' ? 190 : 200,
    }"
    @button-click="handleButtonClick"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    @form-change="handleFormChange"
    @leave-cell-edit="handleLeaveCellEdit"
  >
    <template #expand="scope">
      {{ scope.row }}
    </template>
  </ProPage>
</template>
