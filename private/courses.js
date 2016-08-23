function CoursesViewModel() {
    UserViewModel.call(this, null);

    this.courseDetail = ko.observable();

    this.newCourse = function () {
        if (this.courseDetail())
            this.courseDetail().dispose();
        this.courseDetail(new CourseDetailViewModel());
        $("#course-detail-dialog").modal();
    };
}