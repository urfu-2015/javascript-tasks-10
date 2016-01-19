module.exports = function(grunt) {

require('load-grunt-tasks')(grunt);
require('time-grunt')(grunt);

grunt.initConfig({
    watch: {
        style: {
            files: ['*.css'],
            options: {
                spawn: false,
                livereload: true
            }
        },
        scripts: {
            files: ['*.js'],
            options: {
                spawn: false,
                livereload: true
            }
        },
        images: {
            files: ['img/*.{png,jpg,gif,svg}'],
            options: {
                spawn: false,
                livereload: true
            }
        },
        html: {
            files: ['*.html'],
            options: {
                spawn: false,
                livereload: true
            }
        }
    },

    browserSync: {
        dev: {
            bsFiles: {
                src : [
                    '*.css',
                    '*.js',
                    'img/*.{png,jpg,gif,svg}',
                    '*.html'
                ]
            },
            options: {
                watchTask: true,
                server: {
                    baseDir: './'
                },
                ghostMode: {
                    clicks: true,
                    forms: true,
                    scroll: false
                }
            }
        }
    }
});

grunt.registerTask('default', [
    'browserSync',
    'watch'
]);

};
