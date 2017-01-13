var converter = new showdown.Converter();

function CourseEditViewModel(course, user) {
    this.titleFacts = ko.observableArray();
    this.title = mutableValue(this.titleFacts, function (value, prior) {
        j.fact(createCourseTitle(user, course, value, prior));
    }, '');
    this.instructorFacts = ko.observableArray();
    this.instructor = mutableValue(this.instructorFacts, function (value, prior) {
        j.fact(createCourseInstructor(user, course, value, prior));
    }, '');
    this.abstractFacts = ko.observableArray();
    this.closed = ko.observableArray();

    this.remoteCourses = ko.observableArray([]);
    this.isRemote = ko.computed({
        read: function () {
            return this.remoteCourses().length > 0;
        },
        write: function (value) {
            var prior = this.remoteCourses();
            if (value && prior.length === 0) {
                j.fact(createRemoteCourse(user, course));
            }
            else if (!value && prior.length > 0) {
                j.fact(createRemoteCourseDeletion(user, prior, course._in));
            }
        },
        owner: this
    });

    this.editAbstract = ko.computed({
        read: function () {
            var values = this.abstractFacts();
            return values.length == 0
                ? ""
                : values[0].value;
        },
        write: function (value) {
            j.fact(createCourseAbstract(user, course, value, this.abstractFacts()));
        },
        owner: this
    });

    this.deleteCourse = function () {
        if (window.confirm('Do you want to delete this course?')) {
            j.fact(createCourseDelete(user, course));
            $('#course-edit-dialog').modal('toggle');
        }
    };

    this.isClosed = ko.computed(function () {
        return this.closed().length > 0;
    }, this);

    this.closeCourse = function () {
        j.fact(createCourseClose(user, course));
    }

    this.reopenCourse = function () {
        j.fact(createCourseReopen(user, this.closed()));
    }

    initializeWatches(this);

    function initializeWatches(viewModel) {
        var watches = [
            j.watch(course, [titlesForCourse], addTo(viewModel.titleFacts), removeFrom(viewModel.titleFacts)),
            j.watch(course, [instructorsForCourse], addTo(viewModel.instructorFacts), removeFrom(viewModel.instructorFacts)),
            j.watch(course, [abstractsForCourse], addTo(viewModel.abstractFacts), removeFrom(viewModel.abstractFacts)),
            j.watch(course, [remoteCoursesForCourse], addTo(viewModel.remoteCourses), removeFrom(viewModel.remoteCourses)),
            j.watch(course, [courseIsClosed], addTo(viewModel.closed), removeFrom(viewModel.closed)),
            initializeSessions(viewModel, course, user)
        ];
        viewModel.dispose = dispose(watches);
    }
}