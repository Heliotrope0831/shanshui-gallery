import { createHashRouter } from "react-router";
import { routes } from "./routes";
import React from "react";

// 直接导出 router，不再引用 StaticWrapper
export const router = createHashRouter(
  routes.map((route) => ({
    path: route.path,
    // 这里假设你的 routes 里面组件属性名是 component
    element: React.createElement(route.component),
  }))
);
// ... 你之前的代码 ...

// 必须要有这一行，App.tsx 才能不带花括号导入它
export default RouterView;