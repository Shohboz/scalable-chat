var path = require('path');

module.exports = function(grunt){

  var config = {
    src: 'assets/src/js',
    dist: 'assets/dist',
    static: 'static',
    dest: 'views/prepared'
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bundle: grunt.file.expand({filter: 'isFile', cwd: config.dist}, ['bundle.*']),
    vendor: grunt.file.expand({filter: 'isFile', cwd: config.dist}, ['vendor.*']),
    nodeunit: {
      all: ['tests/*.js']
    },
    preprocess: {
      dist: {
        files: {
          'views/prepared/footer.pug': 'views/templates/footer.pug',
          'views/prepared/header.pug': 'views/templates/header.pug'
        }
      }
    },
    replace: {
      dist: {
        options: {
          variables: {
            bundle: path.join(config.static, '<%= bundle[0] %>'),
            vendor: path.join(config.static, '<%= vendor[0] %>')
          }
        },
        files: [
          {
            expand: true,
            flatten: true,
            src: [
              path.join(config.dest, 'footer.pug'),
              path.join(config.dest, 'header.pug')
            ],
            dest: config.dest
          }
        ]
      }
    }
  });
  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-replace');
  // Tasks
  grunt.registerTask('default', ['preprocess', 'replace']);
  grunt.registerTask('all', ['nodeunit', 'preprocess', 'replace']);
};
