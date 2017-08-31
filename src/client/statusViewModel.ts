class StatusViewModel {
    public error = ko.observable();
    public queueCount = ko.observable(0);
    public loading = ko.observable(false);
    
    public status = ko.computed(() => {
        return this.error()
            ? "Error"
            : this.queueCount() > 0
            ? "Saving..."
            : this.loading()
            ? "Loading..."
            : "";
    }, this);

    constructor() {
        j.onError((message) => {
            this.error(message);
         });
        j.onProgress((queueCount) => {
            this.queueCount(queueCount);
        });
        j.onLoading((loading) => {
            this.loading(loading);
        });
    }
}