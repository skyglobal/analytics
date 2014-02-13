if (typeof demo==='undefined') demo={};
var TestResult = {} ||TestResult;

demo.testResults = (function () {

    var $el = {
        document : $(document),
        body : $("body"),
        testRunLinks : $('.run-test')
    }

    function capitalizeFirstLetter (text) {
        var result = text;
        if (text) {
            result = text.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
            });
        }
        return result;
    }
    function getTestResults(testNamePath) {
        var resultData;
        $.ajax(testNamePath, {async: false}).done(function(data) {
            resultData = new X2JS().xml2json(data.documentElement);
        });
        return resultData;
    }

    function renderTestSuite(test) {
        var html = '',
        testData = {
            name: test._name.split(':')[2],
            failures: +test._failures + +test._errors,
            tests: test._tests,
            assertions: test._assertions
        }

        html += '<ul id="test-suite"><li class="skycom-12 test-case-result">' +
            '<div class="skycom-2"><strong class="test-case-name">' + testData.name + ' </strong></div>' +
            '<div class="skycom-3">Failures: <span>' + testData.failures + '</span></div>' +
            '<div class="skycom-3">Tests: <span>' + testData.tests + '</span></div>' +
            '<div class="skycom-3 right">Assertions: <span>' + testData.assertions + '</span></div>' +
            '</li></ul>';
       return html;
    }

    function renderTestCase(test) {
        var html = '<ul id="test-cases">';

        $.each(test.testcase, function (index, value) {
            var testData = {
                name: capitalizeFirstLetter(value._name.split('_')[2]),
                assertions: value._assertions,
                status: (value.error || value.failure) ? 'skycon-warning' : 'skycon-tick'
            }
            html += '<li class="test-case-result">' +
                '<div class="skycom-9 tests-case-name"><i class="'+ testData.status + ' colour" aria-hidden="true"></i> <span>'  + testData.name + '</span></div>' +
                '<div class="skycom-2">Assertions: <span class="tests-case-assertions">' + testData.assertions + '</span></div>' +
                '</li>';
        });
        html += '</ul>';
        return html;
    }

    function getTest(TestName) {
            return getTestResults('test/reports/TEST-AnalyticsTest-'+ TestName +'.xml');
    }

    function createTest(testName) {
        var test = getTest(testName);

        if(test._failures != 0 || test._errors != 0) {
            debugger;
            $('.result-summary').addClass('failed');
            $('#'+testName + ' i').removeClass('skycon-tick').addClass('skycon-warning color');
            $('#'+testName + ' i').text(" Tests Failed");
        }

        $('#test-' + testName).html(renderTestSuite(test));
        $('#test-' + testName).append(renderTestCase(test));
        $('#'+ testName).lightbox({closeButtonColour: 'black'});
    }

    function bind() {
        $el.document.ready(function () {
            var testName;
           $el.testRunLinks.each(function (index, value) {
                testName = $(value).attr('data-test-name');
                $el.body.append('<article id="test-' + testName + '" class="lightbox-analytics hidden" aria-labelledby="lightbox-demo-link"></article>');
            });
            createTest("Errors");
            createTest("Events");
            createTest("LinkClick");
            createTest("ManualTrigger");
            createTest("PageLoad");
            createTest("Search");
            createTest("Variables");
            createTest("Debug");
        });
    }
    bind();

})();


