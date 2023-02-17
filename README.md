# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## 开始

```bash node版本>=16
# 克隆项目
git clone git@gitlab.11h5.com:platform-work/mp-11h5.git
# 安装依赖
yarn 或 npm i
# 本地开发 启动项目
yarn dev 或 npm run dev
# 本地打包
yarn build 或 npm run build
# 设置pull默认方式
git config --global --add pull.rebase true
# 开发新功能
git pull
# 开发完成后
git add . // 暂存文件
yarn commit // 提交暂存文件到工作区 已集成入npm命令
git push --set-upstream origin 'feature' // 发布自己的本地分支到远程仓库 提交merge request 合并入 master分支
# 准备发布
git checkout master
# 打包版本号 （自动生成changelog package.json自动版本号+1）
yarn release
# 发布 (自动上传gitlab 根据gitlab.ci 自动打标签发布)
yarn pub

```

## 项目目录

```bash
.
├── README.md
├── auto-imports.d.ts // 自动引入ts类型
├── commitlint.config.js // git提交规范插件
├── components.d.ts // 全局组件定义
├── env.d.ts // 全局插件类型定义
├── .versionrc.js // 自动生成tags的模版
├── env     // 公用环境变量
├── .env.development     // 开发环境变量
├── .env.production     // 线上打包开发环境变量
├── .env.production.local     // 本地打包开发环境变量
├── index.html // html模版
├── package-lock.json // 依赖
├── package.json // 依赖文件
├── public // 公共资源文件
│   │   └── common
│   │   │   └── xxxx.js // cdn文件
│   └── favicon.ico
├── src
│   ├── App.vue // vue根组件
│   ├── assets // 静态资源文件
│   │   └── styles // 公共样式
│   │      ├── element-plus.scss
│   │      ├── index.scss
│   │      ├── mixin.scss
│   │      ├── sidebar.scss
│   │      ├── transition.scss
│   │      └── variables.module.scss
│   ├── components // 共用组件
│   │   ├── AppTable // 虚拟表格组件
│   │   │   └── index.vue
│   │   ├── Breadcrumb // 面包屑组件
│   │   │   └── index.vue
│   │   ├── Dialog // 弹窗组件
│   │   │   └── dialog.vue
│   │   ├── Hamburger // 收起左侧栏图标
│   │   │   └── index.vue
│   │   ├── Search // 顶部搜索bar组件
│   │   │   └── index.vue
│   │   └── SvgIcon // svg组件
│   │   ｜   └── index.vue
│   ├── config // 页面表格字段配置 （实际没有用到，后台添加字段，这里只做备份）
│   │   ├── tableField
│   │   │   ├── game
│   │   │   │   └── xxxxxx.ts
│   ├── layout // 布局组件
│   │   ├── components
│   │   │   ├── AppMain.vue // 右侧显示的路由
│   │   │   ├── Navbar.vue // 顶部导航
│   │   │   ├── Sidebar // 左侧导航
│   │   │   │   ├── Link.vue
│   │   │   │   ├── Logo.vue
│   │   │   │   ├── SidebarItem.vue
│   │   │   │   └── index.vue
│   │   │   ├── TagsView // 面包屑下方的快捷路由
│   │   │   │   ├── ScrollPane.vue
│   │   │   │   └── index.vue
│   │   │   └── index.ts
│   │   └── layout.vue // 布局根组件
│   ├── main.ts // vue入口文件
│   ├── permission.ts // 权限校验 动态生成路由
│   ├── router // 静态路由配置
│   │   └── index.ts
│   ├── service // 接口配置
│   │   ├── api // 封装的接口
│   │   │   ├── chat.ts
│   │   │   ├── menu.ts
│   │   │   ├── search.ts
│   │   │   └── user.ts
│   │   └── http.ts // axios封装的http模块
│   ├── store // 全局状态
│   │   ├── index.ts // 导出所有全局模块
│   │   └── modules // 全局状态模块目录
│   │   ｜  ├── app.ts
│   │   ｜  ├── permission.ts
│   │   ｜  ├── search.ts
│   │   ｜  ├── tagView.ts
│   │   ｜  └── user.ts
│   ├── types // 类型定义
│   │   ｜  ├── api
│   │   ｜    └── types.ts // 各个网络模块的返回数据类型
│   │   ├── axios.ts //axios模块的类型
│   │   ├── enum.ts // 全局枚举
│   │   ├── field.ts // 表格字段定义
│   │   ├── mgr.ts // 所有页面返回数据定义
│   │   ├── store.ts //全局状态模块定义
│   │   └── utils.ts //一些ts共用方法
│   ├── utils // 一些工具方法
│   │   ├── storage.ts
│   │   ├── utils.ts
│   │   └── validate.ts
│   └── views // 动态页面
│   ｜  ├── game
│   ｜  │   ├── game-list
│   ｜  │   │   └── game-list.vue
│   ｜  │   └── product
│   ｜  │   ｜   └── product.vue
│   ｜  ├── dashboard
│   ｜  │   └── dashboard.vue
│   ｜  ├── error-page
│   ｜  │   └── 401.vue
│   ｜  ├── redirect
│   ｜  │   └── index.vue
│   ｜  └── system
│   ｜  ｜   └── user
│   ｜  ｜   ｜  └── user.vue
├── tsconfig.json // ts配置
├── tsconfig.node.json
├── vite.config.ts // vite配置
├── yarn-error.log
└── yarn.lock
```
