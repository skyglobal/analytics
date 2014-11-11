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
                files: [ 'grunt/js/**/*.js', 'grunt/sass/**/*.*', 'Gruntfile.js' ],
                tasks: ['jshint','requirejs','compass', 'jekyll:build']
            },
            'jekyll': {
                files: [ '_includes/**/*', '_layouts/**/*', '_data/**/*', '*.html', '_config.yml', 'test/**/*' ],
                tasks: ['jekyll:build']
            }
        },
        clean: {
            analytics: ['lib/*.*']
        },
        jshint: {
            analytics: ['grunt/js/analytics.js',
                'grunt/js/core/config.js','grunt/js/core/track-click.js','grunt/js/core/track-page.js',
                'grunt/js/utils/logger.js','grunt/js/utils/polyfill.js'],
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
                    optimize: none,
                    preserveLicenseComments: false,
                    baseUrl: "grunt/js",
                    dir: "dist/js",
                    removeCombined: true,
                    generateSourceMaps: false,
                    modules:[{
                        name: 'analytics'
                    },{
                        name: 'demo'
                    }]
                }
            }
        },
        mocha: {
            all: {
                src: (function() {
                    return ['_site/test.html', '_site/test/unit/omniture.html'];
                }()),
                options: {
                    run: false,
                    log: true // Set to true to see console.log() output on the terminal
                }
            }
        },
        jekyll: {                            // Task
            options: {                          // Universal options
                bundleExec: true,
                config: '_config.yml'
            },
            build:{
                options: {
                    watch: false,
                    serve: false
                }
            },
            run:{
                options: {
                    watch: true,
                    serve: true
                }
            }
        },
        exec: {
            rakeFunctional: {
                command: 'rake functional'
            }
        }
    });
    // Loading dependencies
    for (var key in grunt.file.readJSON("package.json").devDependencies) {
        if (key !== "grunt" && key.indexOf("grunt") === 0) {
            grunt.loadNpmTasks(key);
        }
    }

    grunt.registerTask('default', ['clean', 'jshint', 'requirejs', 'compass', 'jekyll:build']);
    grunt.registerTask('spy', ['clean', 'jshint', 'requirejs', 'compass', 'jekyll:build', 'watch']);
    grunt.registerTask('hint', ['jshint']);
    grunt.registerTask('testjs', ['requirejs', 'compass', 'jekyll:build','mocha']);
    grunt.registerTask('test', ['testjs', 'exec:rakeFunctional']);
};