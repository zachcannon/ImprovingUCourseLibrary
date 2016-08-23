function CourseDetailViewModel(course, user) {
    this.titleFacts = ko.observableArray();
    this.title = mutableValue(this.titleFacts, function (title, prior) {
        j.fact(createCourseTitle(user, course, title, prior));
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