/**
 * Compile components
 */
const shell = require('shelljs')
const signale = require('signale')
const { Signale } = signale

const VUE_APP_BASE_URL = process.env.VUE_APP_BASE_URL ? process.env.VUE_APP_BASE_URL : '/finder_ue'

const files = [process.cwd() + '/src/components/Upload.vue']

function compile() {
  files.forEach(filePath => {
    let relativePath = filePath.replace(process.cwd(), '.')
    let compName = relativePath.match(/(\w+)?.vue$/)[1]
    const task = `vue-cli-service build --target lib --formats umd,umd-min --dest ./dist${VUE_APP_BASE_URL}/lib/${compName} --name ${compName} ${relativePath}`

    signale.start(task)

    const interactive = new Signale({ interactive: true })
    interactive.pending(task)
    const result = shell.exec(`${task}`)
    if (result.code !== 0) {
      interactive.error(task)
    } else {
      interactive.success(task)
    }
  })
}

// compile lib
compile()
