from nltk.corpus import wordnet as wn
from nltk.corpus import wordnet_ic
from nltk.corpus.reader.wordnet import information_content
# wraps the information_content function
def neg_logP(c, ic_corpus):
    ic =float(information_content(c,ic_corpus))
    return ic

# Determines the most informative subsumer of two gven concepts
# and also returns a similarity value
def compareSense(c1,c2,ic_corpus):
    highest_ic = 0.0
    sense =  0
    # Creates a list 
    common_hypernyms = c2.common_hypernyms(c1)
    for i in common_hypernyms:
        val =neg_logP(i,ic_corpus)
        if val > highest_ic:
            highest_ic =  val
            sense = i
        else:
            pass
    return [sense, highest_ic]
# Calculates the most informative subsumer
def resnik_similarity(w1,w2, ic_corpus):
    max_ic = [0.0, 0.0]
    w1_synsets = wn.synsets(w1)
    w2_synsets = wn.synsets(w2)
    for i in w1_synsets:
        for j in w2_synsets:
            val = compareSense(i,j,ic_corpus)
            #print(val,   max_ic)
            if max_ic[1] < val[1] :
                max_ic = val
    return max_ic
            
#brown_ic = wordnet_ic.ic('/home/jake/nltk_data/corpora/wordnet_ic/ic-brown-add1.dat')
