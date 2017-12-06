#!/usr/bin/env python
# a program to parse specific sentences from a text file
# given a grammar file
# usage: $0 <grammar file> <sentence file> <sentence number [from 0]>

import sys
import nltk
from nltk.parse.chart import *

def parse(sentence, grammarfile, verbose=False):
    grammar = nltk.data.load("file:%s" %(grammarfile))
    chart_parser = ChartParser(grammar,strategy=EARLEY_STRATEGY,trace=0)

    trees = chart_parser.parse(sentence)
    return sentence, len(trees), trees

def read_sentences(sentence_file):
    fd = open(sentence_file)
    sentences = fd.readlines()
    sentences = [sentence.split() for sentence in sentences]
    return sentences

if __name__ == '__main__':
    if len(sys.argv) < 4:
        print ("usage: %s <grammar file> <sentence file> <sentence number> [verbose]" %(sys.argv[0]))
        exit(1)

    grammarfile = sys.argv[1]
    sentence_file = sys.argv[2]
    sent_num = int(sys.argv[3])

    verbose = False
    if len(sys.argv) >= 5:
        verbose = True

    sentences = read_sentences(sentence_file)
    if sent_num < 0 or sent_num >= len(sentences):
        print ("error: sentence %d not in %s" %(sent_num, sentence_file))
        exit(1)

    sentence, num_parses, trees = parse(sentences[sent_num],grammarfile, verbose)

    print ("sentence\t# parses\ttime [us]")
    print ("%s\t%d\t%d" %(" ".join(sentence), num_parses))
    i = 1
    if verbose:
        for tree in trees:
            print ("%d:\n%s" %(i, tree))
            i += 1
