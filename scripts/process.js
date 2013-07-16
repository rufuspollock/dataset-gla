var csv = require('csv')
  , fs = require('fs') 
  , path = require('path')
  ;

var headings = [
  'Vendor ID',
  'Vendor Name',
  'Cost Element',
  'Expenditure Account Code Description',
  'Document No',
  'Amount',
  'Date'
  ]
var info = JSON.parse(fs.readFileSync('scrape.json'));

function main() {
  var indir = 'archive/latest';
  var outdir = 'tmp/clean';
  // info.sources = info.sources.slice(1,20);
  info.sources.forEach(function(url) {
    var name = path.basename(url);
    var src = path.join(indir, name);
    var dest = path.join(outdir, name);
    if (name == '2012-13-P8-250.csv') {
      //  bad data (html file rather than csv!)
      return;
    }
    console.log(name);
    csv()
      .from(src)
      .to(dest)
      .transform(function(row, idx) {
        if (idx == 0) {
          return headings;
        }
        var mapfunc = fixer[name];
        if (!mapfunc) {
          return [];
        }
        try {
          return mapfunc(row, idx, name);
        } catch(e) {
          console.log(e);
          console.log(row);
          console.log(name + ':' + idx);
        }
      })
      .on('error', function(e) {
        console.error('*** ERROR with ' + name);
        console.error(e);
      })
      ;
  });
}

var fixer = {
  'Mayor%27s%20250%20Report%20-%202013-14%20-%20P1%20%20-%20Combined.csv': std,
  '2012-13-P13-250.csv': std,
  '2012-13-P12-250.csv': std,
  '2012-13-P11-250.csv': std,
  '2012-13-P10-250.csv': std,
  '2012-13-P9-250.csv': std,
  '2012-13-P8-250.csv': std,
  '2012-13-P7-250.csv': std,
  '2012-13-P6-250.csv': std,
  '2012-13-P5-250.csv': std,
  '2012-13-P4-250.csv': std,
  '2012-13-P3-250.csv': std,
  '2012-13-P2-250.csv': std,
  '2012-13-P1-500.csv': std,
  '2011-12-P13-500.csv': std,
  '2011-12-P12-500.csv': std,
  '2011-12-P11-500.csv': std,
  'Mayors500Report-2011-12-P10-Final.csv': std,
  'Mayors-500-report2011-12-P9.csv': std,
  '2011-12-P8-500.csv': std,
  '2011-12-P7-500.csv': std,
  '2011-12-P6-500.csv': std,
  '2011-12-P5-500.csv': std,
  '2011-12-P4-500.csv': std,
  '2011-12-P3-500.csv': std,
  '2011-12-P2-500.csv': std,
  '2011-12-P1-500.csv': std,
  '2010-11-P13-500.csv': std,
  '2010-11-P12-500.csv': std,
  '2010-11-P11-500.csv': std,
  '2010-11-P10-500.csv': std,
  '2010-11-P09-500.csv': std,
  '2010-11-P08-500.csv': std,
  '2010-11-P07-500.csv': std,
  '2010-11-P06-500.csv': std,
  '2010-11-P05-500.csv': std,
  '2010-11-P04-500.csv': std,
  '2010-11-P03.csv': std,
  '2010-11-P02.csv': std,
  '2010-11-P01.csv': std,
  'P13-2009-10.csv': std,
  'P12- 2009_10_FINAL.csv': std,
  'january_2010.csv': std,
  'december_2009.csv': std,
  'november_2009.csv': std,
  'october_2009.csv': std,
  'september_2009.csv': std,
  'august_2009.csv': std,
  'july_2009.csv': std,
  'june_2009.csv': std,
  'may_2009.csv': std,
  'april_2009.csv': std,
  'march_2009.csv': std,
  'february_2009.csv': std,
  'january_2009.csv': std,
  'december_2008.csv': std,
  'november_2008.csv': std,
  'october_2008.csv': std,
  'september_2008.csv': std,
  'august_2008.csv': std,
  'july_2008.csv': std,
  'june_2008.csv': std,
  'may_2008.csv': std,
  'april_2008.csv': std
}

function std(row, idx, name) {
  // skip rows until the header row
  // startline info extracted separately
  if (idx < info.startline[name]) return null;

  // special cases!!
  // yes believe it or not this file repeats a whole bunch of data at the end of the file
  if (name == '2012-13-P4-250.csv') {
    if (idx > 865) return null;
  }

  while(row[0] == '') {
    row = row.slice(1);
  }
  if (row[0]==='' || row.length < 3 || row[1] == '') return null;

  return fixFields(row);
}

function fixFields(row) {
  // fix amount field
  row[5] = row[5].replace(/,/g, '');
  // -ve amounts. (978) => -978
  if (row[5].indexOf('(') != -1) {
    row[5] = '-' + row[5].replace('(', '').replace(')', '');
  }
  // fix date field
  row[6] = new Date(row[6]).toISOString().slice(0,10);
  return row;
}

function fixUp() {
  csv()
    .from('cache/2013-jan.csv', {columns: true})
    .to('cache/out.csv', {header: true})
    .transform(function(record, idx) {
      if (idx == -1) {
        return record;
      }
      record["Clearing Date"] = new Date(record['Clearing Date']).toISOString().slice(0,10);
      record.Amount = record.Amount.toString().replace(/,/g, '');
      // (978) => -978
      if (record.Amount.indexOf('(') != -1) {
        record.Amount = '-' + record.Amount.replace('(', '').replace(')', '');
      }
      return record;
    })
  ;
}

// fixUp();
main();
