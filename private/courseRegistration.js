function CourseRegistrationViewModel(course, user) {
    this.titleFact = ko.observableArray();
    this.title = ko.computed(function () {
        return this.titleFact() ? this.titleFact().value : '';
    }, this);

    this.agree = function () {
        $('#course-registration-dialog').modal('toggle');
    }

    initializeWatches(this);

    function initializeWatches(viewModel) {
        var watches = [
            j.watch(course, [titlesForCourse], setValue(viewModel.titleFact))
        ];
        viewModel.dispose = dispose(watches);
    }
}