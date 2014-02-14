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
            errors: +test._failures + +test._errors,
            tests: +test._tests,
            time: test._time.substr(0,4)
        }

        html += '<ul id="mocha-stats">'
        html += '<li class="passes">passes:<em>' +  (testData.tests - testData.errors) +'</em></li>';
        html += '<li class="failures">failures:<em>' + testData.errors + '</em></li>';
        html += '<li class="duration">duration:<em>' +  testData.time + 's</em></li>';
        html += '</ul>';
        html += '<ul id="mocha-report"><li class="suite"><h1>' + testData.name + '</h1></li></ul>';

       return html;
    }

    function renderTestCase(test) {
        var html = '<ul>',
        testData;

        $.each(test.testcase, function (index, value) {
            testData = {
                name: capitalizeFirstLetter(value._name.split('_')[2]),
                assertions: value._assertions,
                status: (value.error || value.failure) ? 'fail' : 'pass'
            }
            html += '<li class="test fast ' + testData.status + '"><h2>'  + testData.name + '</h2></li>';
        });
        html += '</ul>';
        return html;
    }

    function getTest(TestName) {
            return getTestResults('test/reports/TEST-AnalyticsTest-'+ TestName +'.xml');
    }

    function createTest(testName) {
        var testData = getTest(testName),
        $testLink = $('#'+testName);

        if(testData._failures != 0 || testData._errors != 0) {
            $testLink.find('span').addClass('error');
            $testLink.find('span').html('<i class="skycon-warning colour" aria-hidden="true"></i> Test failed');
        }

        $('#test-' + testName + ' .mocha-container').html(renderTestSuite(testData));
        $('#test-' + testName + ' #mocha-report li.suite').append(renderTestCase(testData));
        $testLink.lightbox({closeButtonColour: 'black'});
    }

    function bind() {
        $el.document.ready(function () {
            var testName;
           $el.testRunLinks.each(function (index, value) {
                testName = $(value).attr('data-test-name');
               var html = '';
               html += '<article id="test-' + testName + '" class="lightbox-analytics hidden" aria-labelledby="lightbox-demo-link">' +
                   '<div class="alpha skycom-12">' +
                        '<h1></h1>' +
                        '<div class="mocha-container">' +
                        '</div>' +
                   '</div>' +
               '</article>';
                $el.body.append(html);
            });

           $el.testRunLinks.each(function (index, value) {
               var testName = $(value).data('test-name');
               createTest(testName);
           });

        });
    }
    bind();

})();


