from nltk.probability import *
from nltk.corpus import masc_tagged

# Here is where the corpora are stored. The text that ends with training will be used to build a LM
# The texts ending in _tests will be used to test the LM. Note: the two acephalous text are written
# by the same author
text_acephalous_training = masc_tagged.tagged_words(fileids = "written/Acephalous-Internet.txt")
text_acephalous_test = masc_tagged.tagged_words(fileids = "written/Acephalous-Cant-believe.txt")
text_blog_test = masc_tagged.tagged_words(fileids = "written/blog-jet-lag.txt")
# FreqDist are made from each text
fd_ace_training = FreqDist(text_acephalous_training)
fd_ace_test = FreqDist(text_acephalous_test)
fd_blog_test = FreqDist(text_blog_test)

#A UnifromProbDist is made from the training text. This is our LM
upd_ace_training =  UniformProbDist(fd_ace_training)
#List of singletons for each test text
singleton_list_ace_test= [s for s in fd_ace_test.hapaxes()]
singleton_list_blog_test= [s for s in fd_blog_test.hapaxes()]
# Here the singletons for each test set are entered into the LM and their average prob is computed
test_blog = sum([upd_ace_training.prob(s) for s in singleton_list_blog_test])/float(len(singleton_list_blog_test))
test_ace = sum([upd_ace_training.prob(s) for s in singleton_list_ace_test])/float(len(singleton_list_ace_test))

# Determines authorship
if test_ace > test_blog:
    print "Acephalous-Internet.txt and Acephalous-Cant-beleive.txt are written by the same author!!"
else:
    print "Acephalous-Internet.txt and Blog-jet-lag.txt are written by the same author!!"


