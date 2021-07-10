const {src, dest, parallel, series, watch: gulpWatch} = require('gulp')
const {init, stream} = require('browser-sync').create()
const del = require('del')
const scss = require('gulp-sass')(require('node-sass'))
const autoprefixer = require('gulp-autoprefixer')
const groupMediaQueries = require('gulp-group-css-media-queries')


const projectFolder = 'dist'
const sourceFolder = 'src'

const path = {
    build: {
        html: `${projectFolder}/`,
        css: `${projectFolder}/css`
    },
    src: {
        html: `${sourceFolder}/*.html`,
        css: `${sourceFolder}/scss/styles.scss`
    },
    watch: {
        html: `${sourceFolder}/**/*.html`,
        css: `${sourceFolder}/scss/**/styles.scss`
    },
    clean: `${projectFolder}/`
}

const browserSyncConfig = () =>
    init({
        server: {
            baseDir: `./${projectFolder}/`
        },
        port: 3000
    })

const html = () =>
    src(path.src.html)
        .pipe(dest(path.build.html))
        .pipe(stream())

const css = () =>
    src(path.src.css)
        .pipe(scss({
            outputStyle: 'expanded'
        }))
        .pipe(groupMediaQueries())
        .pipe(autoprefixer({
            overrideBrowsersList: ["Last 3 versions"],
            cascad: true
        }))
        .pipe(dest(path.build.css))
        .pipe(stream())

const clean = () => del(path.clean)

const watchFiles = () => {
    gulpWatch([path.watch.html], html)
    gulpWatch([path.watch.css], css)
}

const build = series(clean, parallel(css, html))
const watch = parallel(build, watchFiles, browserSyncConfig)

exports.css = css
exports.html = html
exports.build = build
exports.watch = watch
exports.default = watch
