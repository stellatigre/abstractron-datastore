fs = require 'fs'

gulp = require 'gulp'
coffeelint = require 'gulp-coffeelint'

gulp.task 'default', ['lint']

gulp.task 'lint', ->
	gulp
	.src([
		'./**/*.coffee'
		'!./node_modules/**'
	])
	.pipe(coffeelint())
	.pipe(coffeelint.reporter())
