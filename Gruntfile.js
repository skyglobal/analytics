module.exports = function(grunt) {

    grunt.initConfig({
        watch: {
            'analytics': {
                files: [ 'lib/source/*.js' ],
                tasks: ['jshint','uglify']
            }
        },
        clean: {
            analytics: ['lib/*.*']
        },
        jshint: {
            analytics: ['lib/source/tracking.js'],
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
                    'lib/analytics.js': [
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
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['clean', 'jshint', 'uglify']);
    grunt.registerTask('hint', ['jshint']);
};