from nltk.probability import *
import re
from nltk.corpus import masc_tagged

def findtags(tagged_text):
    #Determines conditional freq dist. of all tags given a word
    cfd = ConditionalFreqDist((tag, word) for (word, tag) in tagged_text)
    # Determines conditional prob dist using cfd above
    cpd = ConditionalProbDist(cfd, MLEProbDist)
    # for each tag in MASC..
    for w in cfd.conditions():
        # If the tag starts with NN...
        if re.match(r'NN.*', str(w)):
            # print the tag, the word with the highest prob, and the prob.
            print (w, cpd[w].max(), cpd[w].prob(cpd[w].max()))

#NOTE: Due to masc_tagged errors, only texts under te category blog
# seem to work
findtags(masc_tagged.tagged_words(categories='blog'))
