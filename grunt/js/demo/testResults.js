if (typeof demo==='undefined') demo={};
var TestResult = {} ||TestResult;
demo.testResults = (function () {

        var xhr;
        if (window.XMLHttpRequest) xhr = new XMLHttpRequest();         // all browsers except IE
        else xhr = new ActiveXObject("Microsoft.XMLHTTP");         // for IE

        xhr.open('GET', 'test/reports/TEST-AnalyticsTest.xml', false);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var item = $(xhr.responseXML.getElementsByTagName('testsuite'));
                TestResult.passed = item.attr('tests');
                TestResult.fails = item.attr('failures');
                TestResult.skipped = item.attr('skipped');
                TestResult.numberOfTest = item.attr('assertions');
            }
        }
        xhr.send();

    function bind() {
        $('#tests-passed').text(TestResult.passed);
        $('#tests-failed').text(TestResult.fails);
        $('#tests-time').text(TestResult.time);
        $('#tests-numberOfTest').text(TestResult.numberOfTest);
        $('#tests-skipped').text(TestResult.skipped);
    }
    bind();
})();
