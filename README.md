This repository contains code and data related to Greater London Authority
spending. Its primary purpose it to prepare the openly available GLA data for
loading into OpenSpending.

See also this blog post <http://schoolofdata.org/2013/03/26/using-sql-for-lightweight-data-analysis/>

## Data

There are ~ 3 headings types (with additional variations and with various columns or not)

Vendor ID,Vendor Name,Cost Element,Expenditure Account Code Description,SAP Document No,Amount £,Clearing Date

Variations:

* Vendor ID,Vendor Name,Cost Element,Expenditure Account Code Description,SAP Document No,Amount £,Clearing Date


## Data Preparation

CSV files are listed on <http://www.london.gov.uk/mayor-assembly/gla/spending-money-wisely/budget-expenditure-charges/expenditure-over-250>

That site states:

> The Mayor is committed to providing financial transparency. In 2008 he instructed that regular reports should be published on all GLA expenditure over £1,000 (including VAT). From summer 2010 the reporting threshhold was reduced to £500 (including VAT), and from Period 1 2011/12 the reporting threshhold was changed to £500 excluding VAT. From Period 2 2012/13 onwards the reporting threshold was changed to £250 excluding VAT.
> 
> From Period 4 2012/13 onwards the report includes expenditure from the GLA's subsidiary, GLA Land & Property Ltd.

There are more than 60 CSV files as of July 2013 (a list can be found in scrape.json").

Unfortunately the "format" varies substantially, not only in terms of fields but in e.g. number of blank columns or blank lines etc etc.

A summary can be found in this [Data Explorer gist][de-gist].

[de-gist]: http://explorer.okfnlabs.org/#rgrp/63e14589091a917d175a/view/grid

Aside: from the presence of "SAP Document No" field in several of the CSVs it appears likely that the GLA are using SAP for their accounting systems.

### Errors

* (July 2013) [Period 8 2012/13](http://static.london.gov.uk/gla/expenditure/docs/2012-13-P8-250.csv) is an HTML file showing a 403 Access Denied from someone's login session
  * <del>(March 2013) Bad file for [Period 8 2012/13 (13 October - 10 November)](http://www.london.gov.uk/sites/default/files/Mayor's%20250%20Report%20-%202012-13%20-%20P8%20%20-%20Final.csv).  The file is not named in the usual way "Mayor's%20250%20Report%20-%202012-13%20-%20P8%20%20-%20Final.csv" and appears to be an Excel file that was not converted to CSV!</del>
* Amounts are formatted with "," making them appear as strings to computers.
* Dates vary substantially in format from "16 Mar 2011" in [this file](http://static.london.gov.uk/gla/expenditure/docs/2010-11-P13-500.csv) to "21.01.2010" in [January 2010 data](http://legacy.london.gov.uk/gla/expenditure/docs/january_2010.csv)
* Use of (978) to indicate negative amounts rather than -978
* Repeated data in [2012-13-P4 file](http://datapipes.okfnlabs.org/csv/html/?url=http://static.london.gov.uk/gla/expenditure/docs/2012-13-P4-250.csv#L870)

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

