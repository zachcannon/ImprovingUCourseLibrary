function CourseViewModel(course, office, user) {
    this.visible = ko.computed(function () {
        return course.in.office === office();
    });
    this.titleFact = ko.observable();
    this.authorNameFact = ko.observable();
    this.abstractFact = ko.observable();

    this.title = ko.computed(function () {
        var t = this.titleFact();
        var value = t ? t.value : '';
        return value;
    }, this);
    this.authorName = ko.computed(function () {
        return this.authorNameFact() ? this.authorNameFact().value : "";
    }, this);
    this.abstract = ko.computed(function () {
        return this.abstractFact() ? converter.makeHtml(this.abstractFact().value) : "";
    }, this);
}