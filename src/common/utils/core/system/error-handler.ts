import { ElNotification } from "element-plus";
import { isArray, useSimpleUuid } from "@/common/utils";
import { useErrorLogStore } from "@/pinia";
import SystemConfig from "@/common/config";

/**
 * 检查当前环境是否符合错误日志的运行
 */
export const checkNeed = () => {
  const { env } = SystemConfig.layoutConfig.errorLog;
  const nodeEnv = import.meta.env.MODE;

  if (isArray(env) && nodeEnv) return env.includes(nodeEnv);
  return false;
};

/**
 * 捕获错误回调
 */
export const errorHandler = (error: any, vm: ComponentPublicInstance | null, info: string) => {
  if (!checkNeed()) return;

  const errorStore = useErrorLogStore();
  errorStore.addErrorLog({
    id: useSimpleUuid(),
    error,
    vm,
    info,
    url: window.location.href,
    hasRead: false,
  });

  // 过滤 HTTP 请求错误
  if (error.status || error.status === 0) return false;
  const errorMap: Record<string, string> = {
    InternalError: "Javascript引擎内部错误",
    ReferenceError: "未找到对象",
    TypeError: "使用了错误的类型或对象",
    RangeError: "使用内置对象时，参数超范围",
    SyntaxError: "语法错误",
    EvalError: "错误的使用了Eval",
    URIError: "URI错误",
  };

  const errorName = errorMap[error.name] || "未知错误";

  ElNotification({
    title: errorName,
    message: error,
    type: "error",
    duration: 3000,
  });
};
