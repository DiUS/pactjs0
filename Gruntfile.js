module.exports = function (grunt) {

    var src = ['src/**/*.js'];
    var test = ['test/unit/**/*.spec.js'];

    // configuration
    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                ignores: ['test/coverage/**/*.js']
            },
            files: {
                src: src
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
                APP_DIR_FOR_CODE_COVERAGE: 'test/coverage/instrument/src'
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
                type: ['cobertura', 'lcov'],
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
    grunt.loadNpmTasks('grunt-istanbul');
    grunt.loadNpmTasks('grunt-env');


    // tasks
    grunt.registerTask('default', ['coverage']);
    grunt.registerTask('test', ['mochaTest:unit']);

    grunt.registerTask('coverage', ['clean', 'env:coverage', 'instrument', 'test', 'storeCoverage', 'makeReport']);

};