function _replace(msg, context = {}) {
  return Object.keys(context)
  .reduce((acc, key) => {
    return acc.replace(new RegExp(`\{\{(\s*)(${key})(\s*)\}\}`), context[key])
  }, msg)
}

function _flatten(src, path = '') {
  return Object.keys(src)
        .reduce((acc, now) => {
          if (typeof src[now] !== 'object') {
            acc[path.concat(now)] = src[now]
          } else {
            Object.assign(acc, _flatten(src[now], path.concat(now, '.')))
          }
          return acc
        }, {})
}

function _parseMsg(messages) {
  return new Map(Object.entries(_flatten(messages)))
}


module.exports = {
  _replace,
  _parseMsg,
  _flatten
}
