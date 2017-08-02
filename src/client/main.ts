class MainViewModel {
    userName: any;

    constructor() {
        this.userName = ko.observable();
    }
}

const j = new Jinaga();
const distributor = new JinagaDistributor(distributorUrl);
const vm = new MainViewModel();

j.sync(distributor);
j.login((user) => {
    vm.userName(JSON.stringify(user));
});

ko.applyBindings(vm);