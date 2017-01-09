function CoordinatorViewModel(coordinator, catalog, access, user) {
    this.nameFact = ko.observable();

    this.name = ko.computed(function () {
        var fact = this.nameFact();
        return fact ? fact.value : '';
    }, this);
    this.hasAccess = ko.computed(function () {
        var c = catalog();
        return access().some(function (a) {
            return c &&
                a.write.office === c.office &&
                a.to.publicKey === coordinator.publicKey;
        });
    }, this);

    this.grant = function () {
        var u = user();
        var c = catalog();
        if (u && c)
            j.fact(createCatalogAccess(u, coordinator, c));
    };
}