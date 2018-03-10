基础组件增加EsLint以及改造react、react-dom依赖方法文档


一、EsLint增加方法
① 项目下package.json中的devDependencies下增加如下规则:
"devDependencies":{
    "react": "^0.14.6",
    "react-dom": "^0.14.6",
    "@beisen/hookformatter": "0.0.2",
    "eslint-loader": "^1.9.0",
    "eslint-plugin-import": "^1.8.1",
    "eslint-plugin-jsx-a11y": "^1.5.3",
    "eslint-plugin-react": "^5.2.2",
    "escope": "^3.6.0",
    "eslint": "^4.3.0",
    "estraverse-fb": "",
}

② 项目下的package.json增加peerDependencies并添加如下规则（改造react、react-dom依赖）
"peerDependencies": {
    "react": "^0.14.6",
    "react-dom": "^0.14.6"
  },

并删除如下规则

"dependencies": {
    "react": "^0.14.6",
    "react-dom": "^0.14.6"
  },

③ 根据新的package.json重新安装包
npm install

④ 目录下增加.eslintrc文件（定义规则）代码在本项目中

⑤ 项目下的webpack.dev.config.js中的loaders下加入如下规则
Ⅰ：在js loader中增加eslint
		
{
				loader : "babel-loader!eslint",
				test : /\.js$/,
				exclude : /node_modules/
			},
        
Ⅱ：在module下增加如下规则
   		eslint: {
  		configFile: '.eslintrc'
  		,formatter: require("@beisen/hookformatter")
	    },
