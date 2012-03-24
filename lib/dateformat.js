/*!
 * dateformat.js v0.0.6
 * https://github.com/minodisk/dateformat-js
 * Copyright (c) 2011 Daisuke MINO
 * Licensed under the MIT license.
 * https://github.com/minodisk/dateformat-js/raw/master/LICENSE
 */
(function () {
  function DateFormat(pattern, asUTC) {
    this._constructor.apply(this, arguments);
  }


  DateFormat.ISO8601 = DateFormat.W3C = DateFormat.ATOM = DateFormat.JSON
    = 'yyyy-MM-ddTHH:mm:sszzz';
  DateFormat.RFC822 = DateFormat.RFC1123 = DateFormat.RFC2822 = DateFormat.RSS
    = 'ddd, dd MMM yyyy HH:mm:ss zzz';
  DateFormat.RFC850 = DateFormat.RFC1036 = DateFormat.COOKIE
    = 'dddd, dd-MMM-yy HH:mm:ss zzz';
  DateFormat.CTIME
    = 'ddd MMM d HH:mm:ss yyyy';
  DateFormat.DATE_TIME
    = 'yyyy-MM-dd HH:mm:ss';


  DateFormat.prototype = {};


  // possible to expand other locale
  DateFormat.names = {};
  DateFormat.names.en = {
    era: {
      abbr: ['BC', 'AD'],
      full: ['B.C.', 'A.D.']
    },
    month: {
      abbr: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      full: ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December']
    },
    day: {
      abbr: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      full: ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
        'Thursday', 'Friday', 'Saturday']
    },
    amPm: {
      abbr: ['AM', 'PM'],
      full: ['A.M.', 'P.M.']
    }
  };


  DateFormat.prototype.asUTC = false;
  DateFormat.prototype.locale = 'en';
  DateFormat.prototype._chunks = null;
  DateFormat.prototype._charMaxLengthMap = { d: 4, f: 3, F: 3, g: 2, h: 2, H: 2, j: 3,
    K: 1, m: 2, M: 4, s: 2, t: 2, y: 5, z: 4 }
  DateFormat.prototype._patternParserMap = {
    d: {type: 'RegExp', value: /\d{1,2}/},
    dd: {type: 'RegExp', value: /\d{2}/},
    f: {type: 'RegExp', value: /\d/},
    ff: {type: 'RegExp', value: /\d{2}/},
    fff: {type: 'RegExp', value: /\d{3}/},
    F: {type: 'RegExp', value: /\d?/},
    FF: {type: 'RegExp', value: /(\d{2})?/},
    FFF: {type: 'RegExp', value: /(\d{3})?/},
    h: {type: 'RegExp', value: /\d{1,2}/},
    hh: {type: 'RegExp', value: /\d{2}/},
    H: {type: 'RegExp', value: /\d{1,2}/},
    HH: {type: 'RegExp', value: /\d{2}/},
    j: {type: 'RegExt', value: /\d{1,3}/},
    K: {type: 'RegExp', value: /(?:UTC|Local)/},
    m: {type: 'RegExp', value: /\d{1,2}/},
    mm: {type: 'RegExp', value: /\d{2}/},
    M: {type: 'RegExp', value: /\d{1,2}/},
    MM: {type: 'RegExp', value: /\d{2}/},
    s: {type: 'RegExp', value: /\d{1,2}/},
    ss: {type: 'RegExp', value: /\d{2}/},
    y: {type: 'RegExp', value: /\d/},
    yy: {type: 'RegExp', value: /\d{2}/},
    yyy: {type: 'RegExp', value: /\d{3,4}/},
    yyyy: {type: 'RegExp', value: /\d{4}/},
    yyyyy: {type: 'RegExp', value: /\d{5}/},
    z: {type: 'RegExp', value: /(?:Z|[\-\+]\d{1,2})/},
    zz: {type: 'RegExp', value: /(?:Z|[\-\+]\d{2})/},
    zzz: {type: 'RegExp', value: /(?:Z|[\-\+]\d{2}\d{2})/},
    zzzz: {type: 'RegExp', value: /(?:Z|[\-\+]\d{2}\:\d{2})/}
  };


  DateFormat.prototype._constructor = function (pattern, asUTC) {

    if (!pattern) {
      pattern = DateFormat.DATE_TIME;
    }

    var charMaxLengthMap = this._charMaxLengthMap,
      len = pattern.length,
      pos = 0,
      buffer = '',
      chunks = [],
      quart = '',
      flush = function (type) {
        if (buffer !== '') {
          chunks[chunks.length] = {
            type: type,
            value: buffer
          };
          buffer = '';
        }
      },
      character, i, iLen;

    while (pos < len) {
      character = pattern.charAt(pos);
      pos++;

      // pattern character
      if (quart === '' && character in charMaxLengthMap) {
        flush('text');
        buffer = character;
        // search the end of the pattern
        for (i = 0,iLen = charMaxLengthMap[character] - 1; i < iLen; i++) {
          if (pattern.charAt(pos + i) === character) {
            buffer += character;
          } else {
            break;
          }
        }
        pos += i;
        flush('pattern');
      }

      // quart character
      else if (character === '"' || character === "'") {
        // second consecutive quart
        if (pattern.charAt(pos) === character) {
          buffer += character;
          pos++;
        }
        // start of quart block
        else if (quart === '' && pattern.indexOf(character, pos) !== -1) {
          quart = character;
        }
        // end of quart block
        else if (character === quart) {
          flush('text');
          quart = '';
        }
        // quart in other quart block or non-closed quart block
        else {
          buffer += character;
        }
      }

      // any other character
      else {
        buffer += character;
      }
    }

    // flush buffer as 'text'
    flush('text');

    this._chunks = chunks;
    this.asUTC = !!asUTC;

  };


  DateFormat.prototype.format = function (date) {

    if (!date) {
      date = new Date();
    }

    var chunks = this._chunks,
      asUTC = this.asUTC,
      names = DateFormat.names[this.locale],
      pad = function (num, length) {
        num = num.toString();
        while (num.length < length) {
          num = '0' + num;
        }
        return num;
      };

    // get the date and time value
    var d, D, f, H, h, M, m, t, y, s, z, fff, ff, h, MNum, t, yStr, g, zSign, zH, zHStr, zm, zmStr;
    if (asUTC) {
      d = date.getUTCDate();
      D = date.getUTCDay();
      f = date.getUTCMilliseconds();
      H = date.getUTCHours();
      M = date.getUTCMonth();
      m = date.getUTCMinutes();
      y = date.getUTCFullYear();
      s = date.getUTCSeconds();      
      z = 0;
    } else {
      d = date.getDate();
      D = date.getDay();
      f = date.getMilliseconds();
      H = date.getHours();
      M = date.getMonth();
      m = date.getMinutes();
      y = date.getFullYear();
      s = date.getSeconds();
      z = date.getTimezoneOffset();
    }
    fff = pad(f, 3);
    ff = fff.substr(0, 2);
    f = fff.substr(0, 1);
    g = (y < 0) ? 0 : 1;
    h = H % 12;
    MNum = M + 1;
    t = (H < 12) ? 0 : 1;
    yStr = pad(y, 5);
    zH = ((z < 0) ? -z : z) / 60 >> 0;
    zSign = (z <= 0) ? '+' : '-';
    zHStr = pad(zH, 2);
    zm = z % 60;
    zmStr = pad(zm, 2);

    // convert date and time value to keyword
    var patternValueMap = {
      d: d.toString(),
      dd: pad(d, 2),
      ddd: names.day.abbr[D],
      dddd: names.day.full[D],
      f: f,
      ff: ff,
      fff: fff,
      F: (parseInt(f, 10) === 0) ? '' : '.' + f,
      FF: (parseInt(ff, 10) === 0) ? '' : '.' + ff,
      FFF: (parseInt(fff, 10) === 0) ? '' : '.' + fff,
      g: names.era.abbr[g],
      gg: names.era.full[g],
      h: h.toString(),
      hh: pad(h, 2),
      H: H.toString(),
      HH: pad(H, 2),
      j: pad(D,3),
      K: (asUTC) ? 'UTC' : 'Local',
      m: m.toString(),
      mm: pad(m, 2),
      M: MNum.toString(),
      MM: pad(MNum, 2),
      MMM: names.month.abbr[M],
      MMMM: names.month.full[M],
      s: s.toString(),
      ss: pad(s, 2),
      t: names.amPm.abbr[t],
      tt: names.amPm.full[t],
      y: yStr.substr(4),
      yy: yStr.substr(3),
      yyy: (y < 1000) ? yStr.substr(2) : y.toString(),
      yyyy: yStr.substr(1),
      yyyyy: yStr,
      z: zSign + zH.toString(),
      zz: zSign + zHStr,
      zzz: zSign + zHStr + zmStr,
      zzzz: zSign + zHStr + ':' + zmStr
    };

    // join keyword and text to formatted date string
    var buffer = '',
      i, iLen, chunk;
    for (i = 0,iLen = chunks.length; i < iLen; i++) {
      chunk = chunks[i];
      buffer += (chunk.type === 'pattern') ? patternValueMap[chunk.value] : chunk.value;
    }
    return buffer;

  };

  DateFormat.prototype.parse = function (str) {

    var chunks = this._chunks,
      asUTC = this.asUTC,
      names = DateFormat.names[this.locale];

    var patternParserMap = this._patternParserMap;
    patternParserMap.ddd = {type: 'Array', value: names.day.abbr};
    patternParserMap.dddd = {type: 'Array', value: names.day.full};
    patternParserMap.g = {type: 'Array', value: names.era.abbr};
    patternParserMap.gg = {type: 'Array', value: names.era.full};
    patternParserMap.MMM = {type: 'Array', value: names.month.abbr};
    patternParserMap.MMMM = {type: 'Array', value: names.month.full};
    patternParserMap.t = {type: 'Array', value: names.amPm.abbr};
    patternParserMap.tt = {type: 'Array', value: names.amPm.full};

    // extract keyword in relation to pattern
    var patternValueMap = {},
      i, iLen, pos, posLen, chunk, chunkValue, parser, parserValue, matched, matchedValue, j, jLen;
    for (i = 0,iLen = chunks.length,pos = 0,posLen = str.length; i < iLen && pos < posLen; i++) {
      chunk = chunks[i];
      if (chunk.type === 'text') {
        pos += chunk.value.length;
      } else {
        chunkValue = chunk.value;
        parser = patternParserMap[chunkValue];
        if (parser.type === 'Array') {
          parserValue = parser.value;
          for (j = 0,jLen = parserValue.length; j < jLen; j++) {
            if (str.indexOf(parserValue[j], pos) === pos) {
              matchedValue = parserValue[j];
              patternValueMap[chunkValue] = matchedValue;
              pos += matchedValue.length;
              break;
            }
          }
        } else {
          matched = str.substr(pos).match(parser.value);
          if (matched && matched.length > 0) {
            matchedValue = matched[0];
            patternValueMap[chunk.value] = matchedValue;
            pos += matchedValue.length;
          }
        }
      }
    }

    // convert keyword to date and time value
    var now = new Date(),
      nowY = now.getUTCFullYear(),
      z, y, g, M, d, t, h, H, m, s, f;

    // abbreviated year, complete digits of recent year
    if (y = patternValueMap.yyyyy || patternValueMap.yyyy || patternValueMap.yyy) {
      y = parseInt(y, 10);
    } else if (y = patternValueMap.yy) {
      y = (nowY / 100 >> 0) * 100 + parseInt(y, 10);
      if (y > nowY) {
        y -= 100;
      }
    } else if (y = patternValueMap.y) {
      y = (nowY / 10 >> 0) * 10 + parseInt(y, 10);
      if (y > nowY) {
        y -= 10;
      }
    } else {
      y = 0;
    }
    g = (g = patternValueMap.gg) ? names.era.full.indexOf(g) :
      (g = patternValueMap.g) ? names.era.abbr.indexOf(g) : 1;
    if (g === 0) {
      y *= -1;
    }
    M = (M = patternValueMap.MMMM) ? parseInt(names.month.full.indexOf(M), 10) :
      (M = patternValueMap.MMM) ? parseInt(names.month.abbr.indexOf(M), 10) :
        (M = patternValueMap.MM || patternValueMap.M) ? parseInt(M, 10) - 1 : 0;
    if (d = patternValueMap.j) {
      d = parseInt(d,10);
      M = 0; //reset month to 0 because we've used Julian day vs month and year
    } else {
      d = (d = patternValueMap.dd || patternValueMap.d) ? parseInt(d, 10) : 0;
    }
    if (H = patternValueMap.HH || patternValueMap.H) {
      H = parseInt(H, 10);
    } else if (h = patternValueMap.hh || patternValueMap.h) {
      if (t = patternValueMap.tt) {
        H = parseInt(h, 10) + 12 * names.amPm.full.indexOf(t);
      } else if (t = patternValueMap.t) {
        H = parseInt(h, 10) + 12 * names.amPm.abbr.indexOf(t);
      } else {
        H = 0;
      }
    } else {
      H = 0;
    }
    m = (m = patternValueMap.mm || patternValueMap.m) ? parseInt(m, 10) : 0;
    s = (s = patternValueMap.ss || patternValueMap.s) ? parseInt(s, 10) : 0;
    f = (f = patternValueMap.fff || patternValueMap.ff || patternValueMap.f ||
      patternValueMap.FFF || patternValueMap.F || patternValueMap.F) ? parseInt(f, 10) : 0;

    // convert date and time value to date object
    var date = new Date();
    date.setUTCFullYear(y, M, d);
    if (z = patternValueMap.zzzz || patternValueMap.zzz || patternValueMap.zz || patternValueMap.z) {
      if (z === 'Z') {
        date.setUTCHours(H, m, s, f);
      } else {
        z = z.match(/^([\+\-])(\d{1,2})\:?(\d{0,2})$/);
        var offset = parseInt(z[2], 10) * 60;
        if (z.length === 2) {
          offset += parseInt(z[3], 10);
        }
        z = ((z[1] === '-') ? 1 : -1) * offset;
        date.setUTCHours(H, m + z, s, f);
      }
    } else if (asUTC) {
      date.setUTCHours(H, m, s, f);
    } else {
      date.setHours(H, m, s, f);
    }
    return date;

  };

  DateFormat.prototype.toString = function () {
    var chunks = this._chunks,
      buffer = '',
      i, iLen, chunk;
    for (i = 0,iLen = chunks.length; i < iLen; i++) {
      chunk = chunks[i];
      buffer += (chunk.type === 'pattern') ? '{' + chunk.value + '}' : chunk.value;
    }
    return '[DateFormat ' + buffer + ']';
  };


  if (typeof exports !== 'undefined') {
    // Node.js
    exports.DateFormat = DateFormat;
  } else if (typeof define !== 'undefined') {
    // RequireJS
    define(function () {
      return DateFormat;
    });
  } else {
    // browser
    if (typeof exports === 'undefined') {
      exports = {};
    }
    exports.Flow = Flow;
  }
})();