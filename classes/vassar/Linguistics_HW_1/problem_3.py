from nltk.probability import *
from nltk.corpus import masc_tagged
from nltk.util import bigrams, trigrams
# Instanitates lists that will store stuff later
training_set = []
test_set = []
word_sents =[]
pos_sents = []
word_training_set = []
pos_training_set = []
word_test_set = []
pos_test_set = []
# Calculates training set len
training_len = int(.90 * len(masc_tagged.sents(categories='blog')))
# Calculates test set len
test_len = int(len(masc_tagged.sents(categories='blog')) - training_len)
counter = 0
#loops trough sentence in the text and makes test and training lists
# for word and pos sentences. Each sentence is a sublist in these lists
# so the sublists themselves are delimiters
for sent in masc_tagged.tagged_sents(categories = 'blog'):
    word_sents =[]
    pos_sents = []
    for word in sent:
        word_sents.append(word[0])
        pos_sents.append(word[1])
    if counter <= training_len:
        word_training_set.append(word_sents)
        pos_training_set.append(pos_sents)
    else:
        word_test_set.append(word_sents)
        pos_test_set.append(pos_sents)
    counter +=1

total_word_sents = word_training_set + word_test_set 
total_pos_sents = pos_training_set + pos_test_set
total_words =[]
total_pos = []

#This flatens the total word and total sentance lists
for (w, p) in zip(total_word_sents, total_pos_sents):
    for (word, pos) in zip(w, p):
        total_words.append(word)
        total_pos.append(pos)


# Calculates total ngram freq for words
total_word_unigrams = len(total_words)
total_word_bigrams = sum([len(list(bigrams(ngrams))) for ngrams in total_word_sents])
total_word_trigrams = sum([len(list(trigrams(ngrams))) for ngrams in total_word_sents])    
# Calculates total ngram freq for POS
total_pos_unigrams = len(total_pos)
total_pos_bigrams = sum([len(list(bigrams(ngrams))) for ngrams in total_pos_sents])
total_pos_trigrams = sum([len(list(trigrams(ngrams))) for ngrams in total_pos_sents])
#Prints the info calculated above
print("Words Total:\nUnigrams:%s\nBigrams:%s\nTrigrams:%s\n" % \
      (total_word_unigrams, total_word_bigrams, total_word_trigrams))
print("POS Total:\nUnigrams:%s\nBigrams:%s\nTrigrams:%s\n" % \
      (total_pos_unigrams, total_pos_bigrams, total_pos_trigrams))

# Calculates all the relevant stats given the training set, testing set,
# and data type
def getStats2(training_set, test_set, data_type):
    #List of ngrams for training list
    training_unigram = [unigram for sent in training_set for unigram in sent]
    training_bigram = [bigram for sent in training_set for bigram in list(bigrams(sent))]
    training_trigram = [trigram for sent in training_set for trigram in list(trigrams(sent))]
    #List of ngrams for test list
    test_unigram = [unigram for sent in test_set for unigram in sent]
    test_bigram = [bigram for sent in test_set for bigram in list(bigrams(sent))]
    test_trigram = [trigram for sent in test_set for trigram in list(trigrams(sent))]
    #FreqDist for each ngram for training list
    fdist_training_unigram = FreqDist(training_unigram)
    fdist_training_bigram =FreqDist(training_bigram)
    fdist_training_trigram = FreqDist(training_trigram)
    #freqDistfor each ngram for  test list 
    fdist_test_unigram = FreqDist(test_unigram)
    fdist_test_bigram =FreqDist(test_bigram)
    fdist_test_trigram = FreqDist(test_trigram)
    #Type freq for ngrams in training list
    training_unigram_freq = fdist_training_unigram.N()
    training_bigram_freq = fdist_training_bigram.N()
    training_trigram_freq = fdist_training_trigram.N()
    #Type freq for ngrams in test list
    test_unigram_freq = fdist_test_unigram.N()
    test_bigram_freq = fdist_test_bigram.N()
    test_trigram_freq = fdist_test_trigram.N()
    #Types for ngrams in training list
    types_training_unigram = set(training_unigram)
    types_training_bigram = set(training_bigram)
    types_training_trigram = set(training_trigram)
    #Types for ngrams in test list
    types_test_unigram = set(test_unigram)
    types_test_bigram = set(test_bigram)
    types_test_trigram = set(test_trigram)
    #types of ngrams not in test set that not in training set
    unigrams_not_in_tr = types_test_unigram - types_training_unigram
    bigrams_not_in_tr = types_test_bigram - types_training_bigram
    trigrams_not_in_tr = types_test_trigram - types_training_trigram
    perecent_unigrams_not_in_tr  = 100 * len(unigrams_not_in_tr)/float(len(types_test_unigram)) 
    perecent_bigrams_not_in_tr  = 100 *len(bigrams_not_in_tr)/float(len(types_test_bigram)) 
    perecent_trigrams_not_in_tr  = 100 *len(trigrams_not_in_tr)/float(len(types_test_trigram)) 

    overall_percent_unigrams = 100 *len(unigrams_not_in_tr)/ float(test_unigram_freq)
    overall_percent_bigrams = 100 * len(bigrams_not_in_tr)/ float(test_bigram_freq )
    overall_percent_trigrams = 100* len(trigrams_not_in_tr)/ float(test_trigram_freq)

    print("""%s\nnum types in unigram training set:%s\n
num types in bigram training set:%s\nnum types in trigram training set: %s """ % (data_type,len(types_training_unigram), \
                                                   len(types_training_bigram), len(types_training_trigram) ))
    print ("""\n%s\nnum types in unigram test set: %s\n
num types in bigram test set:%s\nnum types in trigram test set: %s """ % (data_type,len(types_test_unigram),\
                                                                          len(types_test_bigram), len(types_test_trigram) ))

    print ("""\n%s\nunigrams not in training set: %s\n
bigram not in tr set%s\ntrigrams not in training set: %s """ % (data_type,len(unigrams_not_in_tr),\
                                                                          len(bigrams_not_in_tr), len(trigrams_not_in_tr) ))
    print ("""\n%s\percent unigrams: %s\n
percent bigrams:%s\n percent trigrams: %s """ % (data_type, perecent_unigrams_not_in_tr ,\
                                                                          perecent_bigrams_not_in_tr , perecent_trigrams_not_in_tr))
    print ("""\n%s\noverall percent unigrams: %s\n
overall percent bigrams:%s\noverall percent trigrams: %s """ % (data_type,overall_percent_unigrams,\
                                                                          overall_percent_bigrams, overall_percent_trigrams))

    #print ("""\n%s\nnum  freq of unigrams test set: %s\n
#freqs for bigram in test set:%s\nfreq of trigram  in test set: %s """ % (data_type,test_unigram_freq,\
                                                                          #test_bigram_freq, test_trigram_freq))

getStats2(word_training_set, word_test_set, 'WORD')                    
getStats2(pos_training_set, pos_test_set, 'pos')                    
