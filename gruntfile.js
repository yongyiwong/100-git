var grunt = require('grunt');
var glob = require('glob');
grunt.loadNpmTasks('grunt-purifycss');

var cssSource = glob.sync('./dist/apps/*/styles.*.css').toString();

grunt.initConfig({
  purifycss: {
    options: {
      info: true,
      minify: true,
      rejected: false, // Logs the CSS rules that were removed
      whitelist: ['*transition*', '*dimmer*']
    },
    target: {
      cwd: '.',
      src: ['./apps/frontend/src/app/**/*.ts', './apps/frontend/src/app/**/*.html'],
      css: [cssSource],
      dest: cssSource
    },
  },
});
