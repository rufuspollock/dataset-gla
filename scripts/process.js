var csv = require('csv')
  , fs = require('fs') 
  , path = require('path')
  ;

var headings = [
  'ID',
  'VendorID',
  'Vendor',
  'AccountCode',
  'AccountDescription',
  'DocNo',
  'Amount',
  'Date',
  'Source'
  ]
var info = JSON.parse(fs.readFileSync('scrape.json'));

// Clean up the raw date normalizing all data into a standard set of headers
// parse all the source files from archive/latest/{filename}
// clean them up and write to tmp/clean/{filename}
function cleanup() {
  var indir = 'archive/latest';
  var outdir = 'tmp/clean';
  // info.sources = info.sources.slice(1,30);

  info.sources.forEach(function(url) {
    var name = path.basename(url);
    var src = path.join(indir, name);
    var dest = path.join(outdir, name);
    if (name == '2012-13-P8-250.csv') {
      //  bad data (html file rather than csv!)
      return;
    }
    // console.log(name);
    cleanupFile(src, dest, name, processResults);
  });

  var counter = 0;
  var alldata = [];
  function processResults (records, count) {
    alldata = alldata.concat(records);

    counter ++;
    // not all files processed (note -1 extra for the bad csv file)
    // keep repeating
    if (counter <  info.sources.length -1) return;

    // o/w all files, so let's finish up!

    // sort the data by date then vendor ...
    alldata.sort(function(rec1, rec2) {
      var date1 = rec1[6]
        , date2 = rec2[6]
        , vendor1 = rec1[1]
        , vendor2 = rec2[1]
        ;
      if(date1 === date2) {
        return (vendor1 < vendor2) ? -1 : (vendor2 > vendor1) ? 1 : 0;
      }
      else {
        return (date1 < date2) ? -1 : 1;
      }
    });
    alldata = alldata.map(function(rec, idx) {
      return [idx].concat(rec);
    });

    csv()
      .from.array(alldata)
      .to.path('data/all.csv')
      .to.options({columns: headings, header: true})
  }
}

function cleanupFile(src, dest, name, cb) {
  csv()
    .from(src)
    .to(dest)
    .to.array(cb)
    .transform(function(row, idx) {
      try {
        return cleanupRow(row, idx, name);
      } catch(e) {
        console.log(name + ':' + idx);
        console.log(e);
        console.log(row);
        return null;
      }
    })
    .on('error', function(e) {
      console.error('*** ERROR with ' + name);
      console.error(e);
    })
    .on('end', function(e) {
      // console.log('Done: ' + name);
    });
    ;
}

function cleanupRow(row, idx, name) {
  // skip rows until the header row
  // startline info extracted separately
  if (idx < info.startline[name]) return null;

  // special cases!!
  // yes believe it or not this file has a whole bunch of extra data at the end of the file
  // http://datapipes.okfnlabs.org/csv/html/?url=http://static.london.gov.uk/gla/expenditure/docs/2012-13-P4-250.csv#L873
  if (name == '2012-13-P4-250.csv') {
    if (idx >= 865 && idx <= 877) return null;
  }
  // yup, this one randomly adds a leading column with no header and then a blank column!
  if (name === 'january_2010.csv') {
    row = row.slice(2);
  }

  // strip leading blank columns
  while(row[0] == '') {
    row = row.slice(1);
  }
  tmp = 0;
  while(row[tmp] != '' && tmp < row.length) {
    tmp++;
  }
  row = row.slice(0, tmp);

  // ignore empty rows
  if (row[0]==='' || row.length < 3 || row[1] == '') return null;

  // 7 types of col structure
  //
  // 7 cols: Vendor ID,Vendor Name,Cost Element,Expenditure Account Code Description,SAP Document No,Amount £,Clearing Date

  // 6 cols: Vendor Name,Expenditure Account Code,Expenditure Account Code Description,"SAP Document No","Amount £",Clearing Date
  // e.g. 2010-11-P03.csv (in fact only one of this form afaict)
  // 6 cols: Vendor [or Supplier] Name, Expense Description, Amount, Doc Type, Doc No, Date

  // 5 cols: Supplier,Expense Description,Amount,Doc Type,Doc No
  // e.g. http://datapipes.okfnlabs.org/csv/html/?url=http://legacy.london.gov.uk/gla/expenditure/docs/july_2009.csv
  // 4 cols: Vendor,Expense Description,Amount,Doc No
  //    2010-11-P01.csv
  // 3 cols: Supplier,Expense Description,Amount
  // 3 cols: Vendor, Expense Description, Amount

  // we output to headings structure (see above)
  //    var headings = [
  //      'Vendor ID',
  //      'Vendor Name',
  //      'Cost Element',
  //      'Expenditure Account Code Description',
  //      'Document No',
  //      'Amount',
  //      'Date'
  //      ]
  if (row.length === 3 || row.length === 4 || row.length === 5) {
    // we have to parse the name for the date
    // of form "month_yyyy" except for P13-2009-10.csv
    nameToDateMap = {
      'P13-2009-10.csv': '2009-10-01',
      '2010-11-P01.csv': '2010-04-01',
      '2010-11-P02.csv': '2010-05-01',
      // horrific - Period 12 (7 Feb 2010 - 6 Mar 2010)
      'P12- 2009_10_FINAL.csv': '2010-03-01',
      // (7 Mar 2010 - 31 Mar 2010)
      'P13-2009-10.csv': '2010-03-18'
    }
    if (name in nameToDateMap) {
      var date = nameToDateMap[name];
    } else {
      // toISOString sometimes offsets back a day ...
      // new Date('01 August 2012') => Aug 01 2012 00:00:00 GMT+0100 (BST)
      // toISOString() of that => 2012-07-31T... !!
      var date = new Date('02 ' + name.replace('_', ' ').replace('.csv', '')).toISOString().slice(0,10);
    }
    if (row.length === 3) {
      row = [ '', row[0], '', row[1], '', row[2], date ];
    } else if (row.length === 4) {
      row = [ '', row[0], '', row[1], row[3], row[2], date ];
    } else {
      // only one CSV like this - july_2009
      // http://datapipes.okfnlabs.org/csv/html/?url=http://legacy.london.gov.uk/gla/expenditure/docs/july_2009.csv
      // we will ignore Doc Type (seems to always be PLIN or PLCN ...)
      row = [ '', row[0], '', row[1], row[4], row[2], date ];
    }
  } else if (row.length === 6) {
    // see above - special case
    if (name === '2010-11-P03.csv') {
      row = [ '', row[0], row[1], row[2], row[3], row[4], row[5] ];
    } else {
      // 6 cols: Supplier Name, Expense Description, Amount, Doc Type, Doc No, Date
      row = [ '', row[0], '', row[1], row[4], row[2], row[5] ];
    }
  }

  var sourceid = idx + '-' + name.replace('.csv', '');

  row = fixFields(row);
  row.push(sourceid);
  return row;
}

function fixFields(row) {
  // fix amount field
  row[5] = row[5].replace(/,/g, '').replace(/ /g, '');
  // -ve amounts. (978) => -978
  if (row[5].indexOf('(') != -1) {
    row[5] = '-' + row[5].replace('(', '').replace(')', '');
  }

  // fix date field
  // if '/' in date then like 18/11/2009 and we must normalize to mm/dd/yyyy
  // january_2010.csv:6 has 24.12.2012
  row[6] = row[6].replace(/\./g, '/');
  if (row[6].indexOf('/') != -1) {
    var date = new Date(row[6].replace( /(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1") );
  } else {
    var date = new Date(row[6]);
  }
  row[6] = date.toISOString().slice(0,10);
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
cleanup();
