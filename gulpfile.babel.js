import gulp from 'gulp';
import del from 'del';
import fsExtra from 'fs-extra'
import gulpIconFont from 'gulp-iconfont';
import gulpIconFontCss from 'gulp-iconfont-css';
import { create as browserSyncCreate, 
          stream as browserSyncStream } from 'browser-sync';
import gulpSass from 'gulp-sass';



const paths = {
    dist: {
      src: './dist',
      sass: './dist/scss/*.scss',
    },
    preview: {
      
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
    .on('glyphs', (glyphs, options) => {
        console.log(glyphs, options)
    })
    .pipe(gulp.dest(paths.svg.dist))
}

// Preview methods

// Clean folder icons in preview
export const previewClean = () => del('./preview/icons')

function previewCompileSass() {
  /*
  * Compile sass to preview
  */
  return gulp.src(paths.dist.sass)
    .pipe(gulpSass())
    .pipe(gulp.dest('./preview/icons/'))
}

// Copy folder icons build to preview
const previewCopyFont = () => fsExtra.copy('./dist/fonts', './preview/icons/fonts')

function server() {
  /*
   * Create server to preview
   */
  browserSyncCreate().init({
      server: {
        baseDir: './preview'
      }
  })

}

const build = gulp.series(clean, createIcons)
const preview = gulp.series(
    previewClean, 
    previewCopyFont, 
    previewCompileSass, 
    server
  )

export { 
  build,
  preview
}

