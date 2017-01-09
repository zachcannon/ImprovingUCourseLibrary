function AccessControlViewModel(company, catalog, accessRequests, access, user) {
    this.coordinators = ko.observableArray();
    this.accessRequests = accessRequests;

    watchSemester(this);

    function watchSemester(viewModel) {
        var coordinatorsWatch = j.watch(company, [accessInCompany, userForAccess],
            addTo(viewModel.coordinators, function (coordinator) { return new CoordinatorViewModel(coordinator, catalog, access, user); }),
            removeFrom(viewModel.coordinators));
        coordinatorsWatch.watch([namesForUser], setChildValue('nameFact'));

        viewModel.dispose = dispose([coordinatorsWatch]);
    }
}