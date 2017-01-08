function CourseDetailsViewModel(course) {
    this.titleFact = ko.observable();
    this.title = ko.computed(function () {
        var t = this.titleFact();
        var value = t ? t.value : '';
        return value;
    }, this);

    this.abstractFact = ko.observable();
    this.abstract = ko.computed(function () {
        var a = this.abstractFact();
        var value = a ? a.value : '';
        return this.abstractFact() ? converter.makeHtml(value) : '';
    }, this);

    initializeWatches(this);

    function initializeWatches(viewModel) {
        var watches = [
            j.watch(course, [titlesForCourse], setValue(viewModel.titleFact)),
            j.watch(course, [abstractsForCourse], setValue(viewModel.abstractFact))
        ];
        viewModel.dispose = dispose(watches);
    }
}