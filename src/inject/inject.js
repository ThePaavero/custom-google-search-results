chrome.extension.sendMessage({}, function (response) {
    var readyStateCheckInterval = setInterval(function () {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);
            var extension = new CustomSearchResults();
            setInterval(function () {
                extension.init();
            }, 100);
        }
    }, 10);
});

var CustomSearchResults = function () {

    var settings = {
        'matchesToActions': {
            'https://groups.google.com/': ['Dim:0.5'],
            'stackoverflow.com/': ['Highlight'],
            'www.w3schools.com/': ['Dim:0.2'],
            'https://en.wikipedia.org/wiki/': ['Wikipedia'],
            'https://www.reddit.com/r/': ['Reddit']
        }
    };

    var self = this;

    this.init = function () {
        var resultRows = document.querySelectorAll('.rc');
        for (var i = 0; i < resultRows.length; i ++) {
            var row = resultRows[i];
            if (row.getAttribute('csr-processed')) {
                continue;
            }
            row.setAttribute('csr-processed', true);
            processResultRow(row);
        }
    };

    var processResultRow = function (rowElement) {
        var sourceElement = rowElement.querySelector('cite');
        for (var i in settings.matchesToActions) {
            var matchUrl = i;
            var actions = settings.matchesToActions[i];
            if (sourceElement.innerHTML.indexOf(matchUrl) > - 1) {
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
            } else {
                var citeMarkup = rowElement.querySelector('cite').innerHTML;
                var className = 'csr-domain-' + stringIntoClassName(citeMarkup);
                rowElement.classList.add(className);
            }
        }
    };

    this.actions = {
        'Dim': function (rowElement, opacity) {
            rowElement.style.opacity = opacity;
        },
        'Highlight': function (rowElement) {
            rowElement.classList.add('csr-highlight');
        },
        'Wikipedia': function (rowElement) {
            rowElement.classList.add('csr-wikipedia');
        },
        'Reddit': function (rowElement) {
            rowElement.classList.add('csr-reddit');
        }
    };

    var stringIntoClassName = function (string) {
        var regex = /(?:[\w-]+\.)+[\w-]+/;
        var domain = regex.exec(string)[0];
        className = domain.replace(/\./g, '-');

        return className;
    };

};
