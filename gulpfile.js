const {
  dest, parallel, series, src, watch,
} = require('gulp');

const del = require('del');
const eslint = require('gulp-eslint');
const http = require('http');
const path = require('path');
const pug = require('gulp-pug');
const pugLinter = require('gulp-pug-linter');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const serveHandler = require('serve-handler');
const typedoc = require('gulp-typedoc');
const typescript = require('gulp-typescript');

const OUTPUT_DIR = path.resolve(__dirname, 'dist');

// resources
const eboards = require('./src/resources/eboards.json');

function compilePug() {
  return src(['src/views/**.pug', '!src/views/mixins/**.pug'])
    .pipe(pug({
      pretty: true,
      debug: false,
      data: {
        resources: {
          eboards,
        },
      },
    }))
    .on('error', (err) => console.log(err.message))
    .pipe(rename({
      dirname: '',
      extname: '.html',
    }))
    .pipe(dest(OUTPUT_DIR));
}

function compileTypescript(cb) {
  const pipe = src('src/scripts/**.ts')
    .pipe(typescript())
    .on('error', (err) => { console.log(err.message); pipe.emit('end'); })
    .pipe(rename({
      dirname: '',
      extname: '.js',
    }))
    .pipe(dest(path.resolve(OUTPUT_DIR, 'assets', 'js')))
    .on('end', () => cb());
}

function compileSass() {
  return src('src//styles/*.scss')
    .pipe(sass())
    .pipe(rename({
      dirname: '',
      extname: '.css',
    }))
    .pipe(dest(path.resolve(OUTPUT_DIR, 'assets', 'css')));
}

function compileAssets(cb) {
  src('src/assets/img/**')
    .pipe(dest(path.resolve(OUTPUT_DIR, 'assets', 'img')))
    .on('end', () => cb());
}

function watchFiles(cb) {
  watch('src/views/**/*.pug', compilePug);
  watch('src/scripts/**/*.ts', compileTypescript);
  watch('src/scripts/**/*.sass', compileSass);
  watch('src/assets/**', compileAssets);
  cb();
}

function startServer(cb) {
  const server = http.createServer((req, res) => serveHandler(req, res, { cleanUrls: true, public: 'dist' }));
  server.listen(3000);

  return cb();
}

function clean(cb) {
  del(OUTPUT_DIR)
    .then(() => cb());
}

function docs(cb) {
  src(['README.md', './src/scripts/**.ts'])
    .pipe(typedoc({
      target: 'es5',
      includeDeclarations: true,
      out: './docs',
      name: 'rowanieee.org',
      readme: 'README.md',
      ignoreCompilerErrors: false,
      version: true,
    }))
    .on('end', () => cb());
}

function lintTypescript(cb) {
  src('src/scripts/**.ts')
    .pipe(eslint({ fix: true }))
    .pipe(eslint.format())
    .pipe(dest('src/scripts'))
    .on('error', (err) => { console.log(err.message); })
    .on('end', () => cb());
}

function lintPug() {
  return src('src/views/**/*.pug')
    .pipe(pugLinter({ reporter: 'default', failAfterError: true }))
    .on('error', (err) => { console.log(err.message); });
}

exports.default = series(clean,
  parallel(lintTypescript, lintPug),
  parallel(compilePug, compileTypescript, compileSass, compileAssets));

exports.start_server = startServer;
exports.watch = series(clean,
  parallel(compilePug, compileTypescript, compileSass, compileAssets), startServer, watchFiles);

exports.clean = clean;
exports.docs = docs;
exports.lint_ts = lintTypescript;
exports.lint_pug = lintPug;
