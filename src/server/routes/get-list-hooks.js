import path from 'path'
import fse from 'fs-extra'
import Handlebars from 'handlebars'
import hooksDefault from '../../hooks/hooks'
import {
  abeExtend
  ,coreUtils
} from '../../cli'

var route = function(req, res, next) {
  var html = ''

  abeExtend.hooks.instance.trigger('beforeRoute', req, res, next)

  var page = path.join(__dirname + '/../views/list-hooks.html')
  if (coreUtils.file.exist(page)) {
    html = fse.readFileSync(page, 'utf8')
  }
  
  var allHooks = []

  Array.prototype.forEach.call(Object.keys(hooksDefault), (hook) => {
    var hookString = hooksDefault[hook] + ''
    var match = /\((.*?)\)/.exec(hookString)
    var matchReturn = /return ([a-z1-Z-1-9]+)/.exec(hookString)
    allHooks.push({
      name: hook,
      params: (match) ? match[1] : 'null',
      back: (matchReturn) ? matchReturn[1].replace(';', '') : 'null'
    })
  })

  var template = Handlebars.compile(html, {noEscape: true})
  var tmp = template({
    hooks: allHooks
  })
  
  return res.send(tmp)
}

export default route