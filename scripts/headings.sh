#!/bin/bash
#
# Extract the CSV headings as best we can from the dumped files into a single
# file for analysis

grep -rn ",\"\?Amount" archive/latest/ | sort | sed 's/archive\/latest\///g' > tmp/headings.txt 
echo "" >> tmp/headings.txt
echo "# Not found" >> tmp/headings.txt
grep -rnL ",\"\?Amount" archive/latest/ | sort | sed 's/archive\/latest\///g' >> tmp/headings.txt 

