![Build Status](https://travis-ci.org/BeisenUX/bscpm.svg?branch=master)
![Coverage Status](https://coveralls.io/repos/github/BeisenUX/bscpm/badge.svg?branch=master)

# Node实现的的CLI工具
CLI工具的底层使用Yeoman，Yeoman是可用来实现脚手架工具的底层框（插件扩展机制），其本身并不是解决方案的实现。Yeoman 提供了底层API的接口，和生命周期函数，极大的提高了脚手架解决方案的开发时间。Yeoman社区中目前有 3500 个开源贡献插件可以直接使用。bs-develop-cli 使用了Yeoman底层的技术实现了CLI工具（不仅仅是脚手架）

强大的社区，和文档，可以帮助开发者快速上手，并可以编写一个Node的工具。借助Yeoman的标准、文档、社区，并且使用插件的方式开发Node工具，可以让更多的开发者加入进来共同共建PaaS的本地工具链

## 安装
```
~/ npm install bs-develop-cli -g
```
安装使用了 npm package.json 中的 "bin" 属性，安装完毕后会自动注入 “bscpm” 命令到 /bin 目录下。开发者直接在 shell 中就可以调用到 bscom 命令

## 功能
### 创建组件解决方案
```
~/ bscpm create:cpm
```

##### 项目包含
* 创建项目时可选 storybooks 功能，直接输入 npm run storybooks，即可一个用与本地调试组件的服务
* npm run build:lib，转码ES5
* 带有一个 .publish 文件，用于描述组件在开发态用于配置的元数据描述


### 发布组件到PaaS平台
```
~/ bscpm publish
```
#### 内部发布流程
* 自动登陆npm账号
* 发布组件到 npm
* 发布组件元数据描述到 “组件管理平台”
  * 需要使用 bscpm set publish-path:? 设置 “组件管理平台” 的地址


### 基本变量配置
```
~/ bscpm set ?:?
```
"bscom set ?:?" 是用于配置必要的变量，底层使用 Yeoman 的 [sotrage机制](http://yeoman.io/authoring/storage.html)

#### 需要的预配置
* 设置 “组件管理平台” 的地址
  > ~/ bscpm set publish-path:?
* 设置 npm 用户名
  > ~/ bscpm set npm-user-name:?
* 设置 npm 用户密码
  > ~/ bscpm set npm-user-passwors:?
* 设置 npm 用户邮箱
  > ~/ bscpm set npm-user-email:?

## 更新
* 0.0.36
> 增加了自动登陆 npm 账号的功能，账号信息需要预先配置

* 0.0.38
> 1. 脚手架创建的命令修改成 bscpm create cmp/project
> 2. 脚手架工具添加了项目的创建
> 3. 优化了项目内部结构，维护更清晰
