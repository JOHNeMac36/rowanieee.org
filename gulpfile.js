const { src, dest, series, parallel, watch } = require('gulp');
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
    .on('error', err => {console.log(err.message); this.emit('end')})
    .pipe(dest(OUTPUT_DIR))
    .on('end', () => cb())
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


exports.default = compile_pug
exports.start_server = startServer
exports.watch = series(parallel(compile_pug, startServer), watch_files)
