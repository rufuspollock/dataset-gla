var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var info = {
  "listurl": "http://www.london.gov.uk/mayor-assembly/gla/spending-money-wisely/budget-expenditure-charges/expenditure-over-250",
  "sources": []
};


function getFileList(url) {
  request(url, function(err, resp, body) {
    $ = cheerio.load(body);
    // Data is in 4 tables (3 columns: Period, CSV, PDF)
    // CSV is first a link ...
    $('table tr td a').each(function(idx, html) {
      var offset = $(html).attr('href');
      if (offset && offset.indexOf('.csv') != -1) {
        info.sources.push(offset);
      }
    });
    fs.writeFileSync('scrape.json', JSON.stringify(info, null, 2));
    console.log('CSV files found: ' + info.sources.length);
  });
}

function downloadFiles() {
  info.sources.forEach(function(url) {

  });
}

getFileList(info.listurl);

