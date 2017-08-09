var shell = require('shelljs');

shell.cp('-R', 'views', 'dist/views/');
shell.cp('-R', 'public', 'dist/public/');
shell.cp('-R', 'private', 'dist/private/');
shell.cp('-R', 'bower_components', 'dist/bower_components/');