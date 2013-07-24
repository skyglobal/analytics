module.exports = function(grunt) {

    grunt.initConfig({
        clean: {
            analytics: ['lib/*.*']
        },
        jshint: {
            analytics: ['lib/source/*.js'],
            others: ['Gruntfile.js'],
            options: {
                "globals": {
                    document: false,
                    window: false,
                    console: false,
                    setTimeout: false,
                    clearTimeout: false,
                    setInterval: false,
                    clearInterval: false,
                    sky: false,
                    globalskycom: false
                }
            }
        },
        uglify: {
            analytics: {
                options: {
                    sourceMap: 'lib/analytics.js.map',
                    sourceMapRoot: '../',
                    sourceMappingURL: 'analytics.js.map',
                    sourceMapPrefix: 1
                },
                files: {
                    'js/analytics.js': [
                        'lib/source/omniture.js',
                        'lib/source/tracking.js'
                    ]
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['clean', 'uglify']);
};