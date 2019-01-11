import gulp from 'gulp';
import del from 'del';
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
    formats: ['ttf', 'eot', 'woff']
  },
  iconFontCss: {
    fontName,
    path: 'src/templates/_icons.scss',
    targetPath: '../../dist/scss/icons.scss',
    fontPath: './fonts/',
    cssClass: 'iconfoo'
  }
}

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

export function sass() {
  /*
  * Compile sass
  */
  return gulp.src(paths.dist.sass)
    .pipe(gulpSass())
    .pipe(gulp.dest('./preview/css/'))
}

function server() {
  /*
   * Create server
   */
  browserSyncCreate().init({
      server: {
        baseDir: './dist'
      }
  })
}


const build = gulp.series(clean, createIcons)
const server = gulp.series(sass, server)

export { 
  build,
  server 
}

