this.composeWith(
                require.resolve('../scaffold-solutions/codesandbox/index.js'),
                {
                  contextRoot: this.contextRoot,
                  callback: () => {
                    var { code, stdout } = shelljs.exec('codesandbox ./.temp')
                    console.log(stdout)
                  }
                }
              )