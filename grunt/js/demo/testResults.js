if (typeof demo==='undefined') demo={};
var TestResult = {} ||TestResult;
demo.testResults = (function () {


    var $el = {
        document : $(document),
        body : $("body"),
        testRunLinks : $('.run-test')

    }
    function getTestResults(testNamePath) {

        var resultData;
        $.ajax(testNamePath, {async: false}).done(function(data) {
            resultData = new X2JS().xml2json(data.documentElement);
        });
        return resultData;
    }

    function renderTestSuite(test) {
        var html = '';
        var testData = {
            name: test._name.split(':')[2],
            failures: test._failures,
            tests: test._tests,
            assertions: test._assertions
        }

        html += '<ul id="test-suite"><li class="skycom-12 test-case-result">' +
            '<div class="skycom-2"><span id="tests-case-name">' + testData.name + ' </span></div>' +
            '<div class="skycom-3">Failures <span id="tests-case-name">' + testData.failures + '</span></div>' +
            '<div class="skycom-3">Tests: <span id="tests-case-name">' + testData.tests + '</span></div>' +
            '<div class="skycom-3">Assertions: <span id="tests-case-assertions">' + testData.assertions + '</span></div>' +
            '</li></ul>';
       return html;
    }

    function renderTestCase(test) {
        var html = '';

        $.each(test.testcase, function (index, value) {
            var testData = {
                name: value._name.split('_')[2],
                assertions: value._assertions,
                status: value.failure ? 'failed' : ''
            }
            html += '<ul id="test-cases"><li class="test-case-result">' +
                '<div class="skycom-9"><span id="tests-case-name" class=" ' + testData.status +'">' + testData.name + '</span></div>' +
                '<div class="skycom-2">Assertions: <span id="tests-case-assertions">' + testData.assertions + '</span></div>' +
                '</li></ul>';
        });
        return html;
    }

    function getTest(TestName) {
            return getTestResults('test/reports/TEST-AnalyticsTest-'+ TestName +'.xml');
    }

    function createTest(testName) {
        $('#'+ testName).lightbox({closeButtonColour: 'black', onShow: function () {
            var test = getTest(testName);
            $('#test-' + testName).html(renderTestSuite(test));
            $('#test-' + testName).append(renderTestCase(test));
        }});
    }

    function bind() {
        $el.document.ready(function () {
            var testName;
           $el.testRunLinks.each(function (index, value) {
                testName = $(value).attr('data-test-name');
                $el.body.append('<article id="test-' + testName + '" class="hidden" aria-labelledby="lightbox-demo-link"></article>');
            });
            createTest("Errors");
            createTest("Events");
            createTest("LinkClick");
            createTest("ManualTrigger");
            createTest("PageLoad");
            createTest("Search");
            createTest("Variables");
        });
    }

    bind();

})();


