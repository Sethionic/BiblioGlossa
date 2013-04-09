#!python
# coding:UTF-8 
'''This script should be able to import any given CSV file into any DBMS'''
'''Tested as functional with SQLite, may need slight tweaking for others'''
import csv, sqlite3
from collections import defaultdict as dd #Allow dynamic dictionary assignments


DBPath='../Data.db' #Path to database file to manipulate
FilePath='Lexicon.csv' #Path to CSV file to import
TableName='Vocab' #Table Name within specified database
#This was a shortcut used for testing to avoid typing the data types each time
GivenTypes=['SMALLINT','VARCHAR(1)','VARCHAR(20)','VARCHAR(20)','VARCHAR(50)',\
'VARCHAR(25)','SMALLINT ','VARCHAR(40)','SMALLINT','SMALLINT','VARCHAR(7)',\
'VARCHAR(7)','VARCHAR(4)','SMALLINT','VARCHAR(4)','SMALLINT','VARCHAR(2)',\
'VARCHAR(1)','VARCHAR(1)'] 

DT=dd() #Data Types
con = sqlite3.connect(DBPath)
cur = con.cursor()
with open(FilePath,'rb') as f:
    Temp=f.readline().strip().split(",")

#Essentially, only ask for data types if GivenTypes is not defined
j=0;k=0;
try:
    len(GivenTypes)
    k=1
except NameError:
    k=0

for i in Temp:
    if k:
        DT[i]=GivenTypes[j]
        j+=1
    else:
        DT[i]=raw_input("Data Type for: '{0}':\n".format(i))
    
PK=raw_input("Which is the primary key?:\n")
DT[PK]+=' PRIMARY KEY'
print "\nReviewing Data Types:"
TS='CREATE TABLE {0} ('.format(TableName)
for i in Temp: 
    TS+="{0} {1},".format(i,DT[i])
TS=TS[:-1].strip()+');'
print TS+'\n'
cur.execute(TS)
#cur.execute("CREATE TABLE Vocab (id INTEGER PRIMARY KEY,RootTL,DictFormTL,FutTL,Root,DictForm,Fut_Atcl,POS,English,Menu);")

with open(FilePath,'rb') as fin: # `with` statement available in 2.5+
    # csv.DictReader uses first line in file for column headings by default
    dr = csv.DictReader(fin) # comma is default delimiter
    to_db = [[i[j].decode("utf-8") for j in Temp] for i in dr]
    #print dr #to_db = [(i['col1'], i['col2']) for i in dr]

ColNames=reduce(lambda x,y:x+','+y,Temp)
ValueVars=reduce(lambda x,y:x+','+y,['?' for i in Temp])
DBEntry="INSERT INTO {0} ({1}) VALUES ({2});".format(TableName,ColNames,ValueVars)
#print DBEntry
cur.executemany(DBEntry,to_db)
#cur.executemany("INSERT INTO t (col1, col2) VALUES (?, ?);", to_db)
con.commit()