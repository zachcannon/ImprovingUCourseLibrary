function setOffice() {
    if (window.location.hash && window.location.hash.length > 1 && window.location.hash[0] === '#') {
        Cookies.set('ImprovingU.Office', window.location.hash.slice(1));
    }
}

function OfficeViewModel() {
    var viewModel = this;
    
    this.offices = ['Calgary', 'College Station', 'Columbus', 'Dallas', 'Houston', 'Minneapolis'];
    this.office = ko.observable(getOffice());

    window.addEventListener('hashchange', hashChanged, false);

    function getOffice() {
        if (window.location.hash && window.location.hash.length > 1 && window.location.hash[0] === '#') {
            return window.location.hash.slice(1);
        }
        else {
            var value = Cookies.get('ImprovingU.Office');
            if (value) {
                return value;
            }
            else {
                return 'Dallas';
            }
        }
    }

    function hashChanged() {
        Cookies.set('ImprovingU.Office', window.location.hash.slice(1));
        viewModel.office(window.location.hash.slice(1));
    };
}