var gulp = require("gulp");
var typescript = require("gulp-typescript");
var npmFiles = require("gulp-npm-files");
var spawn = require("child_process").spawn;

var node = null;

process.on("exit", function () {
    if (node) {
        node.kill();
    }
});

gulp.task("build", [ "compile", "copy" ]);

// For files that the developer is likely to change.
gulp.task("compile", function() {
    var serverProject = typescript.createProject("./src/server/tsconfig.json")
    var clientProject = typescript.createProject("./src/client/tsconfig.json")

    gulp.src("./src/server/**/*.ts")
        .pipe(serverProject())
        .js.pipe(gulp.dest("./dist"));
    gulp.src("./src/client/**/*.ts")
        .pipe(clientProject())
        .js.pipe(gulp.dest("./dist/public/js"));

    gulp.src("./views/**/*.pug")
        .pipe(gulp.dest("./dist/views"));
    gulp.src("./public/**/*.*")
        .pipe(gulp.dest("./dist/public"));
    gulp.src("./private/**/*.*")
        .pipe(gulp.dest("./dist/private"));
});

// For files from a third party, which are less likely to change.
gulp.task("copy", function () {
    gulp.src([ "./bower_components/**/*.*" ])
        .pipe(gulp.dest("./dist/bower_components"));

    gulp.src(["./node_modules/**/*.*"])
        .pipe(gulp.dest("./dist/node_modules"));
    // gulp.src(npmFiles(), { base: "./" })
    //     .pipe(gulp.dest("./dist"));
});

// Start node, or restart if it is already running.
gulp.task("compileAndStart", [ "compile" ], function () {
    if (node) {
        node.kill();
    }

    node = spawn("node", [ "./dist/server.js" ], { stdio: "inherit" });
    node.on("close", function (code) {
        if (code === 8) {
            gulp.log("Error detected. Waiting for changes...");
        }
    });
});

// Compile and restart node on change.
gulp.task("default", [ "copy", "compileAndStart" ], function () {
    gulp.watch([ "./src/**/*.ts", "./views/**/*.pug", "./public/**/*.*", "./private/**/*.*" ],
        [ "compileAndStart" ]);
});
