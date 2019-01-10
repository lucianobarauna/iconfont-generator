import gulp from 'gulp';
import del from 'del';
import iconFont from 'gulp-iconfont';
import iconFontCss from 'gulp-iconfont-css';


const paths = {
    dist: './dist',
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
    targetPath: '../../dist/scss/_icons.scss',
    fontPath: './fonts/',
    cssClass: 'iconfoo'
  }
}

export const clean = () => del([paths.dist])

function createIcons () {
  /*
   * Create icons
   */
  return gulp.src(paths.svg.src)
    .pipe(iconFontCss(configPlugins.iconFontCss))
    .pipe(iconFont(configPlugins.iconFont))
    .on('glyphs', (glyphs, options) => {
        console.log(glyphs, options)
    })
    .pipe(gulp.dest(paths.svg.dist))
}


const build = gulp.series(clean, createIcons)

export { build }

