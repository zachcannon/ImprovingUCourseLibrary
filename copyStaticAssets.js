var shell = require('shelljs');

shell.mkdir('-p', 'dist/');

shell.cp('-R', 'views', 'dist/');
shell.cp('-R', 'public', 'dist/');
shell.cp('-R', 'private', 'dist/');
shell.cp('-R', 'bower_components', 'dist/');