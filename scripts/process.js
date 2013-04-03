var csv = require('csv');

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

fixUp();
