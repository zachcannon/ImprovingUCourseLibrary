function initializeUtilities(viewModel) {
    viewModel.copyForward = function () {
        var target = viewModel.catalog();
        var office = target.office;
        var company = target._in._in;
        var user = viewModel.user();

        var source = {
            type: "ImprovingU.Catalog",
            office: office,
            _in: {
                type: "ImprovingU.Semester",
                name: "Fall 2016",
                _in: company,
                from: user
            },
            from: user
        };
        j.query(source, [coursesInCatalog], copyCourses(user, target));
    };

    function coursesInCatalog(c) {
        return j.where({
            type: "ImprovingU.Course",
            _in: c
        }, [j.not(courseIsDeleted)]);
    }

    function copyCourses(user, target) {
        return function(courses) {
            courses.forEach(function (course) {
                var targetCourse = {
                    type: "ImprovingU.Course",
                    from: user,
                    _in: target,
                    createdAt: course.createdAt
                };

                j.query(course, [titlesForCourse], setCourseTitle(user, targetCourse));
                j.query(course, [instructorsForCourse], setCourseInstructor(user, targetCourse));
                j.query(course, [abstractsForCourse], setCourseAbstract(user, targetCourse));
            });
        };
    }

    function setCourseTitle(user, targetCourse) {
        return function (titles) {
            titles.forEach(function (title) {
                var targetTitle = createCourseTitle(user, targetCourse, title.value, []);
                j.fact(targetTitle);
            });
        };
    }

    function setCourseInstructor(user, targetCourse) {
        return function (instructors) {
            instructors.forEach(function (instructor) {
                var targetInstructor = createCourseInstructor(user, targetCourse, instructor.value, []);
                j.fact(targetInstructor);
            });
        };
    }

    function setCourseAbstract(user, targetCourse) {
        return function (abstracts) {
            abstracts.forEach(function (abstract) {
                var targetAbstract = createCourseAbstract(user, targetCourse, abstract.value, []);
                j.fact(targetAbstract);
            });
        };
    }
}