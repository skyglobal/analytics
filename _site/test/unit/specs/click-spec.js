function clickSpec(tc) {
    var describeSpec = 'Text clicked will be sent through to Omniture';

    var dataFixture = {
        dataTrackingLabel: {
            div: {
                'data-tracking-label': 'this is my div-tracking-label label',
                'data-tracking-value': 'this is my div-tracking-label value',
                alt: 'this is my div-tracking-label alt',
                name: 'this is my div-tracking-label name',
                value: 'this is my div-tracking-label value'
            },

            input : {
                'data-tracking-label': 'this is my input-tracking-label label',
                'data-tracking-value': 'this is my input-tracking-label value',
                alt: 'this is my input-tracking-label alt',
                name: 'this is my input-tracking-label name',
                value: 'this is my input-tracking-label value'
            }
        },
        dataTrackingValue: {
           div : {
               'data-tracking-value': 'this is my div-tracking-label value',
               alt: 'this is my div-tracking-value alt',
               name: 'this is my div-tracking-value name',
               value: 'this is my div-tracking-value value'
           },
            input : {
                'data-tracking-value': 'this is my input-tracking-label value',
                alt: 'this is my input-tracking-value alt',
                name: 'this is my input-tracking-value name',
                value: 'this is my input-tracking-value value'
            }
        },

        alt: {
                div : {
                    alt: 'this is my div-alt alt',
                    name: 'this is my div-alt name',
                    value: 'this is my div-alt value'
                },

            input : {
                alt: 'this is my input-alt alt',
                name: 'this is my input-alt name',
                value: 'this is my input-alt value'
            }
        },
        value: {
            div : {
                value: 'this is my div-value value',
                name: 'this is my div-value name'
            },

            input: {
                value: 'this is my input-value value',
                name: 'this is my input-value name'
            }
        },
        name: {
            div: {
                name: 'this is my div-name name'
            },
            input: {
                name: 'this is my input-name name'
            }
        },
        text: {
            attr: {
                div : 'div-text'
        },
            text: "this is my div-text text"
        }
    };

    var htmlElement;

    function createFixtureElement(type, testing) {
        htmlElement = document.createElement(type);
        $(htmlElement).attr(testing);
       $('#fixture-container').append(htmlElement);
        return $(htmlElement);
    }

    describe(describeSpec, function () {

        it('with data-tracking-label first', function () {
            expect(tc.getText(createFixtureElement('div', dataFixture.dataTrackingLabel.div))).to.equal('this is my div-tracking-label label');
            expect(tc.getText((createFixtureElement('input', dataFixture.dataTrackingLabel.input)))).to.equal('this is my input-tracking-label label');
        });

        it('data-tracking-value next', function () {
            expect(tc.getText(createFixtureElement('div', dataFixture.dataTrackingValue.div))).to.equal('this is my div-tracking-label value');
            expect(tc.getText(createFixtureElement('input', dataFixture.dataTrackingValue.input))).to.equal('this is my input-tracking-label value');
        });

        it('then alt attribute', function () {
            expect(tc.getText(createFixtureElement('div', dataFixture.alt.div))).to.equal('this is my div-alt alt');
            expect(tc.getText(createFixtureElement('input', dataFixture.alt.input))).to.equal('this is my input-alt alt');
        });

        it('then the current input value before the original value attribute', function () {
            expect(tc.getText(createFixtureElement('div', dataFixture.value.div))).to.equal('this is my div-value name');//this is ok as div's shouldn't have value attribute
            var $el = createFixtureElement('input', dataFixture.value.input);
            expect(tc.getText($el)).to.equal('this is my input-value value');
            $el.val('pete');
            expect(tc.getText($el)).to.equal('pete');
            $el.val('');
            expect(tc.getText($el)).to.equal('this is my input-value name');
        });

        it('and for backwards compatibility, the name attribute', function() {
            expect(tc.getText((createFixtureElement('div', dataFixture.name.div)))).to.equal('this is my div-name name');
            expect(tc.getText((createFixtureElement('input', dataFixture.name.input)))).to.equal('this is my input-name name');
        });

        it('and finally the text within the tag', function() {
            expect(tc.getText((createFixtureElement('div',dataFixture.text.attr).text(dataFixture.text.text)))).to.equal('this is my div-text text');
            expect(tc.getText($('#input-text'))).to.equal('');
        });

        afterEach(function(){
            $('#fixture-container').empty();
        });

    });

}
if (window.define) {
    define('specs/click-spec', ['core/track-click'], function (tc) {
        return clickSpec(tc);
    });
}
