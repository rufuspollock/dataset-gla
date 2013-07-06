var request = require('request');
var urllib = require('url');
var path = require('path');
var cheerio = require('cheerio');
var fs = require('fs');

var listurl = "http://www.london.gov.uk/mayor-assembly/gla/spending-money-wisely/budget-expenditure-charges/expenditure-over-250";

function getFileList(url) {
  var info = {
    listurl: listurl,
    "sources": []
  };
  request(url, function(err, resp, body) {
    $ = cheerio.load(body);
    // Data is in 4 tables (3 columns: Period, CSV, PDF)
    // CSV is first a link ...
    $('table tr td a').each(function(idx, html) {
      var offset = $(html).attr('href');
      // they have started doing relative paths ...
      if (offset && offset.slice(0,4) != 'http') {
        offset = urllib.resolve(url, offset);
      }
      if (offset && offset.indexOf('.csv') != -1
          // as of 2013-2014 they have started duping the data link in an
          // extra section at bottom of page named "Related Documents"!
          && info.sources.indexOf(offset) == -1
        ) {
        info.sources.push(offset);
      }
    });
    fs.writeFileSync('scrape.json', JSON.stringify(info, null, 2));
    console.log('CSV files found: ' + info.sources.length);
  });
}

function downloadFiles() {
  var d = new Date();
  var outdir = 'archive/' + d.toISOString().slice(0 , 10) + '/';
  var info = JSON.parse(fs.readFileSync('scrape.json'));
  info.sources.forEach(function(url) {
    // unix only
    var name = path.basename(url);
    var dest = outdir + name;
    request(url).pipe(fs.createWriteStream(dest));
  });
};

getFileList(listurl);
downloadFiles();

