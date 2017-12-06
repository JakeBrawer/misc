from nltk.probability import *
from nltk.corpus import masc_tagged

#probA()
def probAandBandC():
    bigram_list = []
    for sent in masc_tagged.tagged_sents(categories='journal'):
        p = [(None, None)]                       # empty token/tag pair
        bigrams = zip(p+sent, sent+p)
        # makes bigrams out of postags in each sentence and appends them together
        for (a,b) in bigrams:
            history = a[1]
            current_tag = b[1]
            bigram_list.append((history, current_tag))
    # Creates a CFD from te bigram list
    cfd = ConditionalFreqDist(bigram_list)
    # creates CPD from CFD calculated above
    cpd = ConditionalProbDist(cfd, MLEProbDist)
    # creates CPD from CFD calculated above using laplace smoothing
    cpd_laplace = ConditionalProbDist(cfd, LaplaceProbDist)
    # creates CPD from CFD calculated above using Good Turing smootign
    cpd_turing = ConditionalProbDist(cfd, SimpleGoodTuringProbDist)
    #Prints every possible combination of POS tag bigram probabilities
    for x in cpd.conditions():
        for y in cpd.conditions():
            print("""For P %s ---> P_MLE(%s|%s) = %s\n
                              P_laplace(%s|%s) = %s\n
                              P_turing(%s|%s) = %s\n""" % ((x, y), y, x, cpd[y].prob(x), y, x, cpd_laplace[y].prob(x),y, x, cpd_turing[y].prob(x)))

probAandBandC()
