import gulp from 'gulp'
import iconfont from 'gulp-iconfont';

const paths = {
    svg: {
        src: './src/svg/*.svg'
    }
}

const configIconFont = {
    fontName: 'xuxa',
    
}

export function createIcons () {
  return gulp.src(paths.svg.src)
    .pipe(iconfont(configIconFont))
}