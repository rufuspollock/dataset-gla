.mode column
.header ON
.width 35
-- basic sum
SELECT "Vendor Name", SUM(Amount) FROM data GROUP BY "Vendor Name" ORDER BY sum(amount) DESC LIMIT 20;
-- sum with average
SELECT "Vendor Name", SUM(Amount), AVG(Amount), COUNT(*) FROM data GROUP BY "Vendor Name" ORDER BY sum(amount) DESC LIMIT 5;

SELECT "Vendor Name", SUM(Amount) FROM data
  WHERE "Vendor Name" NOT LIKE "%Borough%"
  GROUP BY "Vendor Name"
  ORDER BY sum(amount) DESC
  LIMIT 10;

SELECT "Vendor Name", SUM(Amount) FROM data
  WHERE ("Vendor Name" NOT LIKE "%BOROUGH%" AND "Vendor Name" NOT LIKE "%HOUSING%")
  GROUP BY "Vendor Name"
  ORDER BY sum(amount) DESC
  LIMIT 20;

SELECT COUNT(DISTINCT "Vendor Name") FROM data;

SELECT SUM(Amount) FROM data;

