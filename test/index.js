import test from 'ava';
import fs from 'fs';
import m from '../src';
let en, de
async function readTranslation(lang) {
  return new Promise((resolve, reject) => {
    fs.readFile(`${__dirname}/i18n/${lang}.json`, 'utf8', async(err, data) => {
      if (err) return reject(err)
      resolve(JSON.parse(data))
    })
  })
}

test.before(async t => {
  en = await readTranslation('en')
  m.set('en', en)
  de = await readTranslation('de')
  m.set('de', de)
})

test('minimal usecase', async t => {
  t.is(m.__('social._headline'), en.social._headline)
})

test('deep nested usecase', async t => {
  m.use('en', en)
  t.is(m.__('social.icons.facebook._title'), en.social.icons.facebook._title)
})

test('language change', async t => {
  m.use('de')
  t.is(m.__('social._headline'), de.social._headline)
})

test('unvalid stringId', async t => {
  t.is(m.__('social.telegram._title'), 'social.telegram._title')
})

test('missing context en', async t => {
  m.use('en', en)
  t.is(m.__('social._copy', { count : 10000}), 'more than 10000 customers trusted us in {{country}}')
})

test('set default context en', async t => {
  m.use('en', en)
  m.context = { count : 10000, country : 'Tunisia'}
  t.is(m.__('social._copy'), 'more than 10000 customers trusted us in Tunisia')
})

test('override default context en', async t => {
  m.use('en', en)
  m.context = { count : 10000, country : 'Tunisia'}
  t.is(m.__('social._copy', { country : 'UK' }), 'more than 10000 customers trusted us in UK')
})

test('set default context de', async t => {
  m.use('de')
  m.context = { count : 10000, country : 'Tunisia'}
  t.is(m.__('social._copy'), 'Mehr als 10000 Kunden vertrauten uns in Tunisia')
})

test('set default context de', async t => {
  m.use('de')
  m.context = { count : 10000, country : 'Tunisia'}
  t.is(m.__('social._copy', { country: 'Deutschland'}), 'Mehr als 10000 Kunden vertrauten uns in Deutschland')
})

test('mixing context en', async t => {
  m.use('en', en)
  m.context = { count : 10000}
  t.is(m.__('social._copy', { country : 'Palestine' }), 'more than 10000 customers trusted us in Palestine')
})

test('composable en', async t => {
  const s = m.set('en', en)
              .use('en', en)
              .setContext({ count : 50, country :'Japan'})
              .__('social._copy')
  t.is(s, 'more than 50 customers trusted us in Japan')
})
