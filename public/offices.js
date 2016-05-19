var viewModel = {
    offices: ['Dallas', 'Columbus', 'Houston', 'Minneapolis' ],
    office: ko.observable('')
};

ko.applyBindings(viewModel);