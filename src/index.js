'use strict'

const { _parseMsg, _replace } = require('./utils')

class Malal {
  constructor() {
    this.translations = new Map()
    this.activeLang = null
    this.defaultValues = {}
    this.__ = this.translate
  }

  set(lang, messages) {
    if (!this.activeLang) this.activeLang = lang
    this.translations.set(lang, _parseMsg(messages))
    return this
  }

  set context(newContext) {
    Object.assign(this.defaultValues, newContext)
  }
  setContext(newContext) {
    Object.assign(this.defaultValues, newContext)
    return this
  }

  use(lang) {
    this.activeLang = lang
    return this
  }

  translate(transID, values = {}) {
    if (!this.translations.has(this.activeLang)) return transID
    const msg = this.translations.get(this.activeLang).get(transID)
    if (!msg) return transID
    const context = Object.assign({}, this.defaultValues, values)
    return _replace(msg, context)
  }
}


const instance = new Malal()

module.exports = instance
