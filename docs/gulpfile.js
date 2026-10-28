/* eslint-env node */
const gulp = require('gulp');
const execa = require('execa');
const merge = require('merge-stream');
const striptags = require('striptags');
const transform = require('gulp-transform');
const connect = require('gulp-connect');
const getVersion = require('git-repo-version');
const path = require('path');

const addonRoot = path.resolve(__dirname, '..');

// yuidoc.json paths are relative to the addon root, so YUIDoc runs from there.
gulp.task('docs:api', function () {
  return execa(
    'yuidoc',
    [
      '--quiet',
      '--config',
      'docs/yuidoc.json',
      '--project-version',
      getVersion(8, addonRoot),
    ],
    {
      cwd: addonRoot,
      preferLocal: true,
      localDir: __dirname,
    }
  );
});

gulp.task('docs:app', function () {
  return execa('ember', ['build', '--prod']);
});

gulp.task(
  'docs:build',
  gulp.series(gulp.parallel('docs:api', 'docs:app'), function () {
    return merge(
      gulp.src('api/**/*', { base: '.' }),
      gulp.src('dist/**/*'),
      gulp
        .src('../CHANGELOG.md')
        .pipe(transform(striptags, { encoding: 'utf8' }))
    ).pipe(gulp.dest('build'));
  })
);

gulp.task('connect', function () {
  connect.server({
    root: 'build',
  });
});

gulp.task('docs:serve', gulp.series('docs:build', 'connect'));
