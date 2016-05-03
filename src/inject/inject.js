chrome.extension.sendMessage({}, function (response) {
    var readyStateCheckInterval = setInterval(function () {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);
            var extension = new CustomSearchResults();
            extension.init();
        }
    }, 10);
});

var CustomSearchResults = function () {

    var settings = {
        'matchesToActions': {
            'https://groups.google.com/': ['Dim:0.7']
        }
    };

    var self = this;

    this.init = function () {
        var resultRows = document.querySelectorAll('.rc');
        for (var i = 0; i < resultRows.length; i ++) {
            var row = resultRows[i];
            processResultRow(row);
        }
    };

    var processResultRow = function (rowElement) {
        var markup = rowElement.innerHTML;
        for (var i in settings.matchesToActions) {
            var matchUrl = i;
            var actions = settings.matchesToActions[i];
            if (markup.indexOf(matchUrl) > - 1) {
                for (var n in actions) {
                    var me = actions[n];
                    if (me.indexOf(':') > - 1) {
                        var bits = me.split(':');
                        var extraArgument = bits[1];
                        self.actions[bits[0]](rowElement, extraArgument);
                    } else {
                        self.actions[me](rowElement);
                    }
                }
            }
        }
    };

    this.actions = {
        'Dim': function (rowElement, opacity) {
            rowElement.style.opacity = opacity;
        }
    };

};
