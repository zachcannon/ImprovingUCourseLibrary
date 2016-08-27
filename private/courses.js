function CoursesViewModel() {
    UserViewModel.call(this, null);

    this.courses = ko.observableArray();
    this.courseDetail = ko.observable();
    this.accessRequests = ko.observableArray();

    this.requestAccess = function () {
        var user = this.user();
        var catalog = this.catalog();
        if (user && catalog) {
            j.fact(createAccessRequest(user, catalog));
        }
    };
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

    this.canAdminister = ko.computed(function () {
        var catalog = this.catalog();
        var user = this.user();
        return catalog && user && catalog.from.publicKey === user.publicKey;
    }, this);

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
            _in: company,
            from: owner
        };
        viewModel.catalog = ko.computed(function () {
            return getCatalog(viewModel.office());
        });
        watchSemester();

        function watchSemester() {
            var coursesWatch = j.watch(semester, [coursesInSemester], addTo(viewModel.courses, function (course) {
                return new CourseViewModel(course, viewModel.office, viewModel.user, viewModel.courseDetail);
            }), removeFrom(viewModel.courses));
            coursesWatch.watch([titlesForCourse], setChildValue('titleFact'));
            coursesWatch.watch([instructorsForCourse], setChildValue('instructorFact'));
            coursesWatch.watch([abstractsForCourse], setChildValue('abstractFact'));

            var requestsWatch = j.watch(semester, [accessRequestsInSemester],
                addTo(viewModel.accessRequests, function (r) { return new AccessRequestViewModel(viewModel.user(), r); }),
                removeFrom(viewModel.accessRequests));
            requestsWatch.watch([userForAccessRequest, namesForUser], setChildValue('nameFact'));
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

function AccessRequestViewModel(user, request) {
    this.nameFact = ko.observable();
    this.name = ko.computed(function () {
        return this.nameFact() ? this.nameFact().value : '';
    }, this);
    this.visible = ko.computed(function () {
        return true;
    }, this);

    this.approve = function () {
        //
    };
    this.decline = function () {
        j.fact(createAccessRequestDeclined(user, request));
    };
}