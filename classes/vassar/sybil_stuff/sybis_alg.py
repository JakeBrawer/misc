import csv
import re

def make_new_file(website_file, input, output):
    with open(website_file,'r' ) as w, open(input, 'r') as i, open(output, 'w') as o:
        website_list = []
        for line in w:
            cells = line.split(',')
            try:
                name = cells[2].strip() + ' '+ cells[4].strip()
                name = re.sub(r'&', 'and', name)
                website_list.append(name)
            except IndexError:
                print(cells)
            #website_list.append(cells[2] + cells[4])
        print(website_list)
        for line in i:
            cells = line.split(',')
            name =cells[1].strip()+' '+cells[0].strip()
            name = re.sub(r'&', 'and', name)
            print(name)
            if not(name in website_list):
                o.write(line)
            else:
                print(name,'Already there!')

make_new_file('./people-export-20160506204803.csv','./OYL_Database.csv', './output.csv')
