const { src, dest, series, parallel, watch } = require('gulp');
const path = require('path')
const pug = require('gulp-pug')
const rename = require('gulp-rename')
const del = require('del')
const vinylPaths = require('vinyl-paths')
const fs = require('fs')
const typescript = require('gulp-typescript')
const typedoc = require('gulp-typedoc')

const OUTPUT_DIR = path.resolve(__dirname, 'dist')

function compile_pug(cb) {
  const pipe = src(['src/views/**.pug', '!src/views/mixins/**.pug'])
    .pipe(pug({
      pretty: true,
      debug: false,
      data: {
        resources: {
          eboards: require('./src/resources/eboards.json')
        }
      }
    }))
    .on('error', err => { console.log(err.message); pipe.emit('end')})
    .pipe(rename({
      dirname: '',
      extname: '.html'
    }))
    .pipe(dest(OUTPUT_DIR))
    .on('end', () => cb())
}

function compile_ts(cb) {
  const pipe = src('src/scripts/**.ts')
    .pipe(typescript())
    .on('error', err => { console.log(err.message); pipe.emit('end')})
    .pipe(rename({
      dirname: '',
      extname: '.js'
    }))
    .pipe(dest(path.resolve(OUTPUT_DIR, 'assets', 'js')))
    .on('end', () => cb())
}

function compile_assets(cb) {
  src('src/assets/img/**')
    .pipe(dest(path.resolve(OUTPUT_DIR, 'assets', 'img')))
    .on('end', () => cb())
}

function watch_files(cb) {
  watch('src/views/**.pug', compile_pug);
  watch('src/scripts/**.ts', compile_ts);
  watch('src/assets/**', compile_assets);
  cb()
}

function startServer(cb) {
  const handler = require('serve-handler')
  const http = require('http')

  const server = http.createServer((req, res) => handler(req, res, {cleanUrls: true, public: 'dist'}))
  server.listen(3000)

  return cb()

}

function clean(cb) {
  del(OUTPUT_DIR)
    .then(() => cb())
}

function docs(cb) {
  src(['README.md', './src/scripts/**.ts'])
    .pipe(typedoc({
      target: "es5",
      includeDeclarations: true,
      out: "./docs",
      name: "rowanieee.org",
      ignoreCompilerErrors: false,
      version: true,
    }))
    .on('end', () => cb())
}

exports.default = series(clean, parallel(compile_pug, compile_ts, compile_assets))
exports.start_server = startServer
exports.watch = series(clean, parallel(compile_pug, compile_ts, compile_assets), startServer, watch_files)
exports.clean = clean
exports.docs = docs
