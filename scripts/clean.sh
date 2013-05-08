curl "http://static.london.gov.uk/gla/expenditure/docs/2012-13-P11-250.csv" | \
  tail -n +7  | head -n -4 | sed "s/^,//g" > cache/2013-jan.csv
