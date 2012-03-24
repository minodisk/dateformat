(function () {
  var DateFormat = require('../lib/dateformat.js').DateFormat;

  var _case = {};
  var _now, _now0ms, _dateFormats;
  _case.setUp = function (next) {
    _now = new Date();
    _now0ms = new Date();
    _now0ms.setMilliseconds(0);
    _dateFormats = [
      new DateFormat(DateFormat.ISO8601),
      new DateFormat(DateFormat.RFC822),
      new DateFormat(DateFormat.RFC850),
      new DateFormat(DateFormat.CTIME),
      new DateFormat(DateFormat.DATE_TIME),
      new DateFormat("yyyy'_'j")
    ];
    next();
  };

  _case['format -> parse'] = function (test) {
    var i = _dateFormats.length;
    var dateFormat;
    while (i--) {
      dateFormat = _dateFormats[i];
      test.deepEqual(dateFormat.parse(dateFormat.format(_now0ms)), _now0ms);
    }
    test.done();
  };

  module.exports = require('nodeunit').testCase(_case);

})();