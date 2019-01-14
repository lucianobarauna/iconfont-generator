import gulp from 'gulp';
import del from 'del';
import fsExtra from 'fs-extra'
import gulpIconFont from 'gulp-iconfont';
import gulpIconFontCss from 'gulp-iconfont-css';
import browserSync from 'browser-sync';
import gulpSass from 'gulp-sass';
import gulpPug from 'gulp-pug';
import gulpData from 'gulp-data';

const paths = {
    dist: {
      src: './dist',
      sass: './dist/scss/*.scss',
      fonts: './dist/fonts'
    },
    preview: {
      src: './preview',
      icons: './preview/icons',
      json: './preview/dataFonts.json',
      index: './preview/index.pug',
      fonts: './preview/icons/fonts'
    },
    svg: {
      src: './src/svg/*.svg',
      dist: './dist/fonts'
    }
}

const fontName = 'foo-font'

const configPlugins = {
  iconFont: {
    fontName,
    formats: ['ttf', 'eot', 'woff', 'woff2']
  },
  iconFontCss: {
    fontName,
    path: 'src/templates/icons.scss',
    targetPath: '../../dist/scss/icons.scss',
    fontPath: './fonts/',
    cssClass: 'iconfoo'
  }
}

// Build 
export const clean = () => del([paths.dist.src])

function createIcons() {
  /*
   * Create icons
   */
  return gulp.src(paths.svg.src)
    .pipe(gulpIconFontCss(configPlugins.iconFontCss))
    .pipe(gulpIconFont(configPlugins.iconFont))
    .on('glyphs', function(glyphs, opt) {
      fsExtra.writeJSON(paths.preview.json, glyphs)
    })
    .pipe(gulp.dest(paths.svg.dist))
}

// Preview methods

// Clean folder icons in preview
export const previewClean = () => del(paths.preview.icons)

function previewCompileSass() {
  /*
  * Compile sass to preview
  */
  return gulp.src(paths.dist.sass)
    .pipe(gulpSass())
    .pipe(gulp.dest(paths.preview.icons))
}

export function previewCreateHtml() {
  /**
   * Create html to preview
   */
  return gulp.src(paths.preview.index)
    .pipe(gulpData(() => {
      return {
        'dataFont': {
          "cssClass": configPlugins.iconFontCss.cssClass,
          "glyphs": fsExtra.readJSONSync(paths.preview.json)
        }
      }
    }))
    .pipe(gulpPug({
      pretty: true
    }))
    .pipe(gulp.dest(paths.preview.src))
}

/**
 * Copy build font icon to folder preview
 */
const previewCopyFont = () => fsExtra.copy(paths.dist.fonts, paths.preview.fonts)

function server() {
  /*
   * Create server to preview
   */
  browserSync({
    server: {
      baseDir: 'preview'
    }
  })
  gulp.watch(['*.html', '*.css'], {cwd: 'preview'}).on('change', browserSync.reload)

}

const build = gulp.series(clean, createIcons)
const preview = gulp.series(
    previewClean,
    previewCreateHtml, 
    previewCopyFont,
    previewCompileSass,
    server
  )

export { 
  build,
  preview
}

