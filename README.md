
# Node实现的的CLI工具

## 安装
~/ npm install bs-develop-cli -g

## 提供的功能
#### 创建组件解决方案
~/ bscpm create:cpm
##### 项目包含
* 创建项目时可选 storybooks 功能，直接输入 npm run storybooks，即可一个用与本地调试组件的服务
* npm run build:lib，转码ES5
* 带有一个 .publish 文件，用于描述组件在开发态用于配置的元数据描述

## 发布组件到PaaS平台
~/ bscpm publish
#### 内部发布流程
* 自动登陆npm账号
* 发布组件到 npm
* 发布组件元数据描述到 “组件管理平台”
  * 需要使用 bscpm set publish-path:? 设置 “组件管理平台” 的地址

## 需要的预配置
* ~/ bscpm set publish-path:? -设置 “组件管理平台” 的地址
* ~/ bscom set npm-user-name:? -设置 npm 用户名
* ~/ bscom set npm-user-passwors:? -设置 npm 用户密码
* ~/ bscom set npm-user-email:? -设置 npm 用户邮箱
