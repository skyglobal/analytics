if (typeof demo==='undefined') demo={};
var TestResult = {} || TestResult;

demo.testResults = (function () {

    var $body = $("body");
    var $testRunLinks = $('.run-test');
    var xmlParser = new X2JS();

    function capitalizeFirstLetter(text) {
        if (!text) { return ''; }
        var result = text.toLowerCase().replace(/\b[a-z]/g, function(letter) {
            return letter.toUpperCase();
        });
        return result;
    }

    function getTestResults(testNamePath) {
        var resultData;
        $.ajax(testNamePath, {async: false}).done(function(data) {
            resultData = xmlParser.xml2json(data.documentElement);
        });
        return resultData;
    }

    function renderTestSuite(results) {
        var data = {
            name: results._name.split(':')[2],
            errors: parseInt(results._failures,10) + parseInt(results._errors,10),
            tests: parseInt(results._tests,10),
            time: results._time.substr(0,4)
        };

        return '<ul id="mocha-stats">' +
                '<li class="passes">passes:<em>' +  (data.tests - data.errors) +'</em></li>' +
                '<li class="failures">failures:<em>' + data.errors + '</em></li>' +
                '<li class="duration">duration:<em>' +  data.time + 's</em></li>' +
                '</ul>' +
                '<ul id="mocha-report"><li class="suite"><h1>' + data.name + '</h1></li></ul>';
    }

    function renderTestCase(test) {
        var html = '<ul>',
        testData;
        $.each(test.testcase, function (index, value) {
            testData = {
                name: capitalizeFirstLetter(value._name.split('_')[2]),
                assertions: value._assertions,
                status: (value.error || value.failure) ? 'fail' : 'pass'
            };
            html += '<li class="test fast ' + testData.status + '"><h2>'  + testData.name + '</h2></li>';
        });
        html += '</ul>';
        return html;
    }

    function createTest(testName) {
        var testData = getTestResults('test/reports/TEST-AnalyticsTest-'+ testName +'.xml'),
        $testLink = $('#'+testName);

        if(testData._failures != 0 || testData._errors != 0) {
            $testLink.find('span').addClass('error');
            $testLink.find('span').html('<i class="skycon-warning colour" aria-hidden="true"></i> Test failed');
        }

        $('#test-' + testName + ' .mocha-container').html(renderTestSuite(testData));
        $('#test-' + testName + ' #mocha-report li.suite').append(renderTestCase(testData));
        $testLink.lightbox({closeButtonColour: 'black'});
    }

    function createLightbox(testName){
        var html = '<article id="test-' + testName + '" class="lightbox-analytics hidden" aria-labelledby="lightbox-demo-link">' +
            '<div class="alpha skycom-12">' +
            '<h1></h1>' +
            '<div class="mocha-container">' +
            '</div>' +
            '</div>' +
            '</article>';
        $body.append(html);
    }

    function createResultsLightboxes(){
        $testRunLinks.each(function (index, value) {
            var testName = $(value).attr('data-test-name');
            createLightbox(testName);
            createTest(testName);
        });
    }

    createResultsLightboxes();
})();