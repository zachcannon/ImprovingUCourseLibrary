var viewModel = {
    offices: ['Dallas', 'Columbus', 'Houston', 'Minneapolis', 'College Station'],
    office: ko.observable('')
};

ko.applyBindings(viewModel);