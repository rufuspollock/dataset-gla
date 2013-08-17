.mode column
.header ON
.width 35

-- total
SELECT SUM(Amount) FROM consolidated;

-- total vendors
SELECT COUNT(DISTINCT "Vendor") FROM consolidated;

-- by month
SELECT SUM(amount), strftime("%Y-%m", Date) FROM consolidated GROUP BY strftime("%Y-%m", Date);

-- basic sum
SELECT "Vendor", SUM(Amount) FROM consolidated GROUP BY "Vendor" ORDER BY sum(amount) DESC LIMIT 20;

-- sum with average
SELECT "Vendor", SUM(Amount), AVG(Amount), COUNT(*) FROM consolidated GROUP BY "Vendor" ORDER BY sum(amount) DESC LIMIT 5;

-- by  vendor w/o boroughs
SELECT "Vendor", SUM(Amount) FROM consolidated
  WHERE "Vendor" NOT LIKE "%Borough%"
  GROUP BY "Vendor"
  ORDER BY sum(amount) DESC
  LIMIT 10;

-- by  vendor w/o boroughs and housing
SELECT "Vendor", SUM(Amount) FROM consolidated
  WHERE ("Vendor" NOT LIKE "%BOROUGH%" AND "Vendor" NOT LIKE "%HOUSING%")
  GROUP BY "Vendor"
  ORDER BY sum(amount) DESC
  LIMIT 20;

