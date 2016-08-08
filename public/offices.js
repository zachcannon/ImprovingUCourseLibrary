var viewModel = {
    offices: ['Dallas', 'Columbus', 'Houston', 'Minneapolis', 'College Station', 'Calgary'],
    office: ko.observable('')
};

ko.applyBindings(viewModel);