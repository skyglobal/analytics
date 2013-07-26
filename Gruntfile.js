module.exports = function(grunt) {

    var cli = grunt.cli;

    cli.optlist.beautify = {
        "short": "B",
        info: "Set beautify on",
        type: String
    };

    grunt.initConfig({
        watch: {
            'analytics': {
                files: [ 'js/*.js', 'Gruntfile.js' ],
                tasks: ['jshint','requirejs']
            }
        },
        clean: {
            analytics: ['lib/*.*']
        },
        jshint: {
            analytics: ['js/tracking.js'],
            others: ['Gruntfile.js'],
            options: {
                "globals": {
                    document: false,
                    window: false,
                    console: false,
                    setTimeout: false,
                    clearTimeout: false,
                    setInterval: false,
                    clearInterval: false
                }
            }
        },

        requirejs:{
            analytics: {
                options: {
                    optimize: grunt.option('beautify') ? "none" : "uglify2",
                    preserveLicenseComments: false,
                    baseUrl: "js",
                    dir: "lib",
                    removeCombined: true,
                    generateSourceMaps: true,
                    modules:[{
                        name: 'tracking'
                    }]
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['clean', 'jshint', 'requirejs']);
    grunt.registerTask('hint', ['jshint']);
};