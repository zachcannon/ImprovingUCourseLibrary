var converter = new showdown.Converter();

function CourseDetailViewModel(course, user) {
    this.titleFacts = ko.observableArray();
    this.title = mutableValue(this.titleFacts, function (value, prior) {
        j.fact(createCourseTitle(user, course, value, prior));
    }, '');
    this.instructorFacts = ko.observableArray();
    this.instructor = mutableValue(this.instructorFacts, function (value, prior) {
        j.fact(createCourseInstructor(user, course, value, prior));
    }, '');
    this.abstractValues = ko.observableArray();
    this.abstract = ko.computed(function () {
        var values = this.abstractValues();
        return values.length == 0
            ? ""
            : converter.makeHtml(values[0].value);
    }, this);
    this.editing = ko.observable(false);
    this.isRemote = ko.observable(false);

    this.editAbstract = ko.computed({
        read: function () {
            var values = this.abstractValues();
            return values.length == 0
                ? ""
                : values[0].value;
        },
        write: function (value) {
            j.fact(createCourseAbstract(user, course, value, this.abstractValues()));
        },
        owner: this
    });

    this.toggleEditAbstract = function () {
        this.editing(!this.editing());
    };

    this.deleteCourse = function () {
        if (window.confirm('Do you want to delete this course?')) {
            $('#course-detail-dialog').modal('toggle');
        }
    };

    initializeWatches(this);

    function initializeWatches(viewModel) {
        var watches = [
            j.watch(course, [titlesForCourse], addTo(viewModel.titleFacts), removeFrom(viewModel.titleFacts))
        ];
        viewModel.dispose = dispose(watches);
    }
}