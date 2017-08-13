var converter = new showdown.Converter();

function CoursesViewModel() {
    var semesterName = "Summer 2017";
    
    UserViewModel.call(this, null);

    this.courses = ko.observableArray();
    this.courseDetails = ko.observable();

    var owner = {
        type: "Jinaga.User",
        publicKey: "-----BEGIN RSA PUBLIC KEY-----\nMIGJAoGBAIBsKomutukULWw2zoTW2ECMrM8VmD2xvfpl3R4qh1whzuXV+A4EfRKMb/UAjEfw\n5nBmWvcObGyYUgygKrlNeOhf3MnDj706rej6ln9cKGL++ZNsJgJsogaAtmkPihWVGi908fdP\nLQrWTF5be0b/ZP258Zs3CTpcRTpTvhzS5TC1AgMBAAE=\n-----END RSA PUBLIC KEY-----\n"
    };
    var company = {
        type: "ImprovingU.Company",
        name: "Improving",
        from: owner
    };
    var semester = {
        type: "ImprovingU.Semester",
        name: semesterName,
        _in: company,
        from: owner
    };

    initializeSemester(this);

    function initializeSemester(viewModel) {
        viewModel.semesterName = semesterName;
        viewModel.catalog = ko.computed(function () {
            return getCatalog(viewModel.office());
        });
        watchSemester();

        function watchSemester() {
            var coursesWatch = j.watch(semester, [coursesInSemester], addTo(viewModel.courses, function (course) {
                return new CourseViewModel(course, viewModel.office, viewModel.user, viewModel.courseEdit, viewModel.courseDetails, viewModel.canWrite, viewModel.registration);
            }), removeFrom(viewModel.courses));
            coursesWatch.watch([titlesForCourse], setChildValue('titleFact'));
            coursesWatch.watch([instructorsForCourse], setChildValue('instructorFact'));
            coursesWatch.watch([remoteCoursesForCourse], setChildValue('remoteFact'));
            coursesWatch.watch([registrationsForCourse], addToChild('registrations'), removeFromChild('registrations'));
        }

        function getCatalog(office) {
            var catalog = {
                type: "ImprovingU.Catalog",
                office: office,
                _in: semester,
                from: owner
            };
            return catalog;
        }
    }
}

function byCourseTitle(a, b) {
    var aTitle = a.title();
    var bTitle = b.title();
    if (aTitle < bTitle)
        return -1;
    if (aTitle > bTitle)
        return 1;
    return 0;
}