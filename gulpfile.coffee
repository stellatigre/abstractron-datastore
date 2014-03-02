fs = require 'fs'

gulp = require 'gulp'
coffeelint = require 'gulp-coffeelint'

gulp.task 'default', ['lint']

gulp.task 'lint', ->
	gulp
	.src([
		'./DB/**/*.coffee'
		'./routes/**/*.coffee'
		'./app.coffee'
	])
	.pipe(coffeelint())
	.pipe(coffeelint.reporter())
