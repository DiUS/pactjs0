module.exports = function (grunt) {

    var src = ['lib/*.js', 'lib/util/*.js', 'lib/services/*.js', 'lib/test/*.js'];
    var test = ['test/unit/*.js'];

    // configuration
    grunt.initConfig({

        jshint: {
            options: {
                jshintrc: '.jshintrc',
                ignores: ['test/coverage/**/*.js']
            },
            files: {
                src: ['lib/*.js', 'lib/util/*.js', 'lib/services/*.js']
            },
            gruntfile: {
                src: 'Gruntfile.js'
            }
        },


        mochaTest: {
            unit: {
                options: {
                    reporter: ['spec']
                },
                src: test
            }
        },


        // start - code coverage settings

        env: {
            coverage: {
                APP_DIR_FOR_CODE_COVERAGE: 'test/coverage/instrument/lib'
            }
        },


        clean: {
            coverage: {
                src: ['test/coverage/']
            }
        },


        instrument: {
            files: src,
            options: {
                lazy: true,
                basePath: 'test/coverage/instrument/'
            }
        },


        storeCoverage: {
            options: {
                dir: 'test/coverage/reports'
            }
        },


        makeReport: {
            src: 'test/coverage/reports/**/*.json',
            options: {
                type: ['cobertura', 'lcov', 'teamcity'],
                dir: 'test/coverage/reports',
                print: 'detail'
            }
        }

        // end - code coverage settings

    });


    // plugins
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-istanbul');
    grunt.loadNpmTasks('grunt-env');


    // tasks
    grunt.registerTask('server', ['concurrent:target']);
    grunt.registerTask('default', ['coverage']);
    grunt.registerTask('test', ['mochaTest:unit']);

    grunt.registerTask('coverage', ['jshint', 'clean', 'env:coverage', 'instrument', 'test', 'storeCoverage', 'makeReport']);

};