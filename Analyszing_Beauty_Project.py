import nltk
from nltk.probability import *
import codecs
path = '/home/jake/org/responses.txt'
text =  open(path, 'r', encoding='ascii', errors='ignore')
#print(text.read())
sentences = nltk.sent_tokenize(text.read())
words = [nltk.word_tokenize(sent) for sent in sentences]
new_words = [words for sent in words for words in sent if len(words) >= 4]
tagged_words = nltk.pos_tag(new_words)
adjectives = [a for (a,b) in tagged_words if 'JJ' in b]
nouns = [a for (a,b) in tagged_words if 'NN' == b]
#print(nouns)
print(tagged_words)
newest_words = [a for (a, b) in tagged_words if (b != 'DT') and b != 'IN' and 'W' not in b and b != 'CC' and 'PRP' not in b]
#print(newest_words)
bigrams = nltk.bigrams(newest_words)

#tok_text = nltk.sent_tokenize(open(path, 'r').read())

fdist = nltk.FreqDist(newest_words)
fdist_adj = nltk.FreqDist(adjectives)
fdist_nouns = nltk.FreqDist(nouns)
cfd = nltk.ConditionalFreqDist(bigrams)
pr
#cfd.plot(samples=new_words[:20]
new_cfd = nltk.ConditionalFreqDist(
    (adj, noun)
    for adj in adjectives
    for noun in nouns)

cpd = nltk.ConditionalProbDist(cfd,MLEProbDist)
print(cpd['beautiful'].max())

print(fdist.most_common(20))
most_common_nouns = [a for (a,b) in fdist_nouns.most_common(8)]
most_common_adj = [a for (a,b) in fdist_adj.most_common(8)]
cfd.tabulate(conditions=most_common_adj, samples=most_common_nouns)
print(most_common_adj)
for h in most_common_nouns:
    print('Given: %s, most probable: %s ' % (h, cpd[h].max()))

#cfd.plot(samples=most_common)
# for x in cpd.conditions():
#     for y in cpd.conditions():
#         print("""For P %s ---> P_MLE(%s|%s) = %s\n""" % ((x, y), y, x, cpd[y].prob(x)))
print(nltk.pos_tag(most_common_words))
text.close()

