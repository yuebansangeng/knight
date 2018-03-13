#!/usr/bin/env node

// 执行指定的 command，不依赖 yo 命令
require('yeoman-environment').createEnv()
  .register(require.resolve('../generators/scaffold'), 'scaffold')
  .run('scaffold Component')
