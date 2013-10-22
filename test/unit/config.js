requirejs.config({
    baseUrl: '../../grunt/js/',
    paths: {
        mocha: '../../test/unit/vendor/mocha',
        chai: '../../test/unit/vendor/chai',
        smoax: '../../test/unit/vendor/smoax',
        jquery: 'vendor/jquery-1.10.2'
    },
    shim: {
        smoax: {
            exports: 'Smoax'
        }
    },
    urlArgs: 'v=' + new Date().getTime()
});