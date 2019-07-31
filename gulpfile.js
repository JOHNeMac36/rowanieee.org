const { src, dest, series, watch } = require('gulp');
const path = require('path')
const pug = require('gulp-pug')
const rename = require('gulp-rename')
const del = require("del")

const OUTPUT_DIR = path.resolve(__dirname, 'dist')

function compile_pug(cb) {
  src(['src/views/**.pug', '!src/views/mixins/**.pug'])
    .pipe(pug({
      pretty: true,
      debug: false,
    }))
    .pipe(rename({
      dirname: '',
      extname: '.html'
    }))
    .pipe(dest(OUTPUT_DIR))

  return cb()
}

function watch_files(cb) {
  watch('src/**', compile_pug);
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
  del("dist", {force: true})
  cb()
}

exports.default = compile_pug
exports.start_server = startServer
exports.watch = series(compile_pug, startServer, watch_files)
exports.clean = clean
