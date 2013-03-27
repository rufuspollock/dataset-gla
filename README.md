This repository contains code and data related to Greater London Authority
spending. Its primary purpose it to prepare the openly available GLA data for
loading into OpenSpending.

See also this blog post <http://schoolofdata.org/2013/03/26/using-sql-for-lightweight-data-analysis/>

## Plan

* Script to convert a given file (month) into a standardized CSV form (follow [data package](http://www.dataprotocols.org/en/latest/data-packages.html))
  * Clean up dates
  * Clean up amounts (remove ',')
* Post result to http://data.openspending.org/ (s3)
* Load most recent month to OpenSpending
* Script to consolidate all files
* Post result to http://data.openspending.org/
* Load this to OpenSpending
* Post on the [OpenSpending City map](http://apps.openspending.org/maps/)

Repeat monthly part each month as new data becomes available!

