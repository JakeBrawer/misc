#!/usr/bin/env python

import nltk
from nltk.parse import pchart
from datetime import datetime
import cfg_parse

def pcfg_chartparser(grammarfile):
 f = open(grammarfile)
 grammar = nltk.PCFG.fromstring(f.read())
 f.close()
 return nltk.ViterbiParser(grammar)


def main():
  viterbi_parser = pcfg_chartparser("wsjp.cfg")
  sents = cfg_parse.read_sentences("sentences.txt")
#  print ("sentence\ttime elapsed (us)")
  for sent in sents:
      print (sent)
      for tree in viterbi_parser.parse(sent):
          print (tree)
if __name__ == '__main__': main()
