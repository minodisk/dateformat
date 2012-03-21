# dateformat.js
Formatting Date to String and parsing String to Date module for Node.js, RequireJS, and browser.

## Installation
    $ npm install dateformatjs


## Usage
    var DateFormat = require('dateformatjs').DateFormat;
    var df = new DateFormat("yyyy'-'MM'-'dd' 'HH':'mm':'ss.fff' 'zzzz");
    df.format(new Date());
    df.parse('1981-07-04 15:02:06.050 +09:00');

## Allowed specifiers
The following specifiers are defined.
<table>
<thead>
<tr><th rowspan="2">Format Specifier</th><th rowspan="2">Description</th><th colspan="2">Examples</th></tr>
<tr><th>7/4/1981 15:2:6.05 GMT+09:00</th><th></th></tr>
</thead>
<tbody>
<tr><td>d</td><td>The day of the month, from 1 through 31.</td><td>4</td><td></td></tr>
<tr><td>dd</td><td>The day of the month, from 01 through 31.</td><td>04</td><td></td></tr>
<tr><td>ddd</td><td>The abbreviated name of the day of the week.</td><td>Sat</td><td></td></tr>
<tr><td>dddd</td><td>The full name of the day of the week.</td><td>Saturday</td><td></td></tr>
<tr><td>f</td><td>The tenths of a second in a date and time value.</td><td>0</td><td></td></tr>
<tr><td>ff</td><td>The hundredths of a second in a date and time value.</td><td>05</td><td></td></tr>
<tr><td>fff</td><td>The milliseconds in a date and time value.</td><td>050</td><td></td></tr>
<tr><td>F</td><td>If non-zero, the tenths of a second in a date and time value.</td><td>(no output)</td><td></td></tr>
<tr><td>FF</td><td>If non-zero, the hundredths of a second in a date and time value.</td><td>05</td><td></td></tr>
<tr><td>FFF</td><td>If non-zero, the milliseconds in a date and time value.</td><td>050</td><td></td></tr>
<tr><td>g</td><td>The abbreviated name of period or era.</td><td>AD</td><td></td></tr>
<tr><td>gg</td><td>The full name of period or era.</td><td>A.D.</td><td></td></tr>
<tr><td>h</td><td>The hour, using a 12-hour clock from 1 to 12.</td><td>3</td><td></td></tr>
<tr><td>hh</td><td>The hour, using a 12-hour clock from 01 to 12.</td><td>03</td><td></td></tr>
<tr><td>H</td><td>The hour, using a 24-hour clock from 0 to 23.</td><td>15</td><td></td></tr>
<tr><td>HH</td><td>The hour, using a 24-hour clock from 00 to 23.</td><td>15</td><td></td></tr>
<tr><td>K</td><td>Time zone information.</td><td>UTC, Local</td><td></td></tr>
<tr><td>j</td><td>Julian day of the year.</td><td>025</td><td></td></tr>
<tr><td>m</td><td>The minute, from 0 through 59.</td><td>2</td><td></td></tr>
<tr><td>mm</td><td>The minute, from 00 through 59.</td><td>02</td><td></td></tr>
<tr><td>M</td><td>The month, from 1 through 12.</td><td>7</td><td></td></tr>
<tr><td>MM</td><td>The month, from 01 through 12.</td><td>07</td><td></td></tr>
<tr><td>MMM</td><td>The abbreviated name of the month.</td><td>Jul</td><td></td></tr>
<tr><td>MMMM</td><td>The full name of the month.</td><td>July</td><td></td></tr>
<tr><td>s</td><td>The second, from 0 through 59.</td><td>6</td><td></td></tr>
<tr><td>ss</td><td>The second, from 00 through 59.</td><td>06</td><td></td></tr>
<tr><td>t</td><td>The abbreviated AM/PM designator.</td><td>PM</td><td></td></tr>
<tr><td>tt</td><td>The full AM/PM designator.</td><td>P.M.</td><td></td></tr>
<tr><td>y</td><td>The year, from 0 to 99.</td><td>1</td><td></td></tr>
<tr><td>yy</td><td>The year, from 00 to 99.</td><td>81</td><td></td></tr>
<tr><td>yyy</td><td>The year, with a minimum of three digits.</td><td>1981</td><td></td></tr>
<tr><td>yyyy</td><td>The year as a four-digit number.</td><td>1981</td><td></td></tr>
<tr><td>yyyyy</td><td>The year as a five-digit number.</td><td>01981</td><td></td></tr>
<tr><td>z</td><td>Hours offset from UTC, with no leading zeros.</td><td>+9</td><td></td></tr>
<tr><td>zz</td><td>Hours offset from UTC, with a leading zero for a single-digit value.</td><td>+09</td><td></td></tr>
<tr><td>zzz</td><td>Hours and minutes offset from UTC.</td><td>+0900</td><td></td></tr>
<tr><td>zzzz</td><td>Hours and minutes offset from UTC.</td><td>+09:00</td><td></td></tr>
<tr><td>"*", '*'</td><td>Literal string delimiter.</td><td>*</td><td></td></tr>
<tr><td>"", ''</td><td>Double quote and single quote.</td><td>", '</td><td></td></tr>
<tr><td>*</td><td>Any other character.</td><td>*</td><td></td></tr>
</tbody>
</table>

## License
Licensed under the [MIT license](https://github.com/minodisk/dateformat-js/raw/master/LICENSE).

