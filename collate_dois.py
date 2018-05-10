import glob
import os
import csv
try:
    from progress.bar import Bar
    bars = True
except ImportError:
    bars = False
 
#One big tsv, same as previous layout but with an added language column.
#Forcing UTF-8 everywhere we can in a vague attempt to fix encoding issues.

all_files = glob.glob(os.path.join("IdentifiersData", "*wiki.tsv"))
output_file = os.path.join('identifiers_collated.tsv')

with open(output_file, 'a', encoding='utf-8') as csvfile:
    
    csvwriter = csv.writer(csvfile, delimiter='\t')
    csvwriter.writerow(['language', 'page_id', 'page_title', 'rev_id', 'timestamp', 'type', 'id'])

    if bars:
        bar = Bar('Progress', max=len(all_files), suffix='%(percent)d%%')
    for file in all_files:
        wiki_name = file.split("/")[1][:-8]

        with open(file, 'r', encoding='utf-8') as wiki_file:
            wiki_data = csv.reader(wiki_file, delimiter='\t')
            next(wiki_data)

            for row in wiki_data:
                row.insert(0,wiki_name)
                csvwriter.writerow(row)
        if bars:
            bar.next()

if bars:
    bar.finish()