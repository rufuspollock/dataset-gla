wget http://static.london.gov.uk/gla/expenditure/docs/2012-13-P11-250.csv
tail -n +7 2012-13-P11-250.csv | head -n -4 | sed "s/^,//g" > 2013-jan.csv
