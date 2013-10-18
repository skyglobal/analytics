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
                files: [ 'grunt/js/*.js', 'grunt/sass/**/*.*', 'Gruntfile.js' ],
                tasks: ['jshint','requirejs','compass']
            }
        },
        clean: {
            analytics: ['lib/*.*']
        },
        jshint: {
            analytics: ['grunt/js/analytics.js'],
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
        compass: {
            dist: {
                options: {
                    sassDir: 'grunt/sass/',
                    cssDir: 'dist/css/',
                    outputStyle: grunt.option('beautify') ? "expanded" : "compressed" ,
                    noLineComments: true,
                    trace: true
                }
            }
        },
        requirejs:{
            analytics: {
                options: {
                    optimize: grunt.option('beautify') ? "none" : "uglify2",
                    preserveLicenseComments: false,
                    baseUrl: "grunt/js",
                    dir: "dist/js",
                    removeCombined: true,
                    generateSourceMaps: false,
                    modules:[{
                        name: 'analytics'
                    },{
                        name: 'wiki'
                    }]
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['clean', 'jshint', 'requirejs', 'compass']);
    grunt.registerTask('hint', ['jshint']);
};