function CoursesViewModel() {
    UserViewModel.call(this, null);

    this.courseDetail = ko.observable();

    this.newCourse = function () {
        if (this.courseDetail())
            this.courseDetail().dispose();

        var user = this.user();
        var catalog = this.catalog();
        if (user && catalog) {
            var course = createCourse(user, catalog);
            this.courseDetail(new CourseDetailViewModel(course, user));
            $("#course-detail-dialog").modal();
        }
    };

    initializeSemester(this);

    function initializeSemester(viewModel) {
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
            name: "Fall 2016",
            in: company,
            from: owner
        };
        viewModel.catalog = ko.computed(function () {
            return getCatalog(viewModel.office());
        });
        watchSemester();

        function watchSemester() {
            var coursesWatch = j.watch(semester, [coursesInSemester], addTo(viewModel.courses, function (course) {
                return new CourseViewModel(course, viewModel.office, viewModel.user);
            }), removeFrom(viewModel.courses));
        }

        function getCatalog(office) {
            var catalog = {
                type: "ImprovingU.Catalog",
                office: office,
                in: semester,
                from: owner
            };
            return catalog;
        }
    }
}