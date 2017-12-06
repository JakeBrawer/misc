from nltk.corpus import conll2000
import nltk
import re
import pprint
#print(conll2000.chunked_sents('train.txt')[99])
class ConsecutiveNPChunkTagger(nltk.TaggerI): 

    def __init__(self, train_sents):
        train_set = []
        for tagged_sent in train_sents:
            untagged_sent = nltk.tag.untag(tagged_sent)
            history = []
            for i, (word, tag) in enumerate(tagged_sent):
                featureset = npchunk_features(untagged_sent, i, history) 
                train_set.append( (featureset, tag) )
                history.append(tag)
        self.classifier = nltk.MaxentClassifier.train(
            train_set, algorithm='megam', trace=0)

    def tag(self, sentence):
        history = []
        for i, word in enumerate(sentence):
            featureset = npchunk_features(sentence, i, history)
            tag = self.classifier.classify(featureset)
            history.append(tag)
        return zip(sentence, history)

class ConsecutiveNPChunker(nltk.ChunkParserI):
    def __init__(self, train_sents):
        tagged_sents = [[((w,t),c) for (w,t,c) in
                         nltk.chunk.tree2conlltags(sent)]
                        for sent in train_sents]
        self.tagger = ConsecutiveNPChunkTagger(tagged_sents)

    def parse(self, sentence):
        tagged_sents = self.tagger.tag(sentence)
        conlltags = [(w,t,c) for ((w,t),c) in tagged_sents]
        return nltk.chunk.util.conlltags2tree(conlltags)

def npchunk_features(sentence, i, history):
    word, pos = sentence[i]
    if i == 0:
        prevword, prevpos = "<START>", "<START>"
    else:
        prevword, prevpos = sentence[i-1]
    if i == len(sentence)-1:
        nextword, nextpos = "<END>", "<END>"
    else:
        nextword, nextpos = sentence[i+1]
    # this stuff will get word and pos two words away
    if i < len(sentence) - 2 :
	nextnextword, nextnextpos = sentence[i+2]
    else:
        nextnextword, nextnextpos = "<END>", "<END>"
							
    return {"pos": pos,
            "word": word,
            "prevpos": prevpos,
            "nextpos": nextpos, 
	    "nextnextpos": nextnextpos,
            "prevpos+pos": "%s+%s" % (prevpos, pos),  
	# Concats nextnextpos
            "pos+nextpos+nextnextpos": "%s+%s+%s" % (pos, nextpos,nextnextpos),
            "tags-since-dt": tags_since_dt(sentence, i),
	#perhaps word length is an indicator of a np?
 	    "word_len": len(word),
	    "len_prev_word": len(prevword),
	#slightly increases recall
	    "tags_after_curr_word": tags_after_curr_word(sentence, i)}
	# This negatively affects percision
	   # "len_next_next_word": len(nextnextword

def tags_since_dt(sentence, i):
    tags = set()
    for word, pos in sentence[:i]:
        if pos == 'DT':
            tags = set()
        else:
            tags.add(pos)
    return '+'.join(sorted(tags))

# This stores the tags that come after the current word
def tags_after_curr_word(sentence, i):
    tags = set()
    for word, pos in sentence[i:]:
	tags.add(pos)
    return '+'.join(sorted(tags))

test_sents = conll2000.chunked_sents('test.txt', chunk_types=['NP'])
train_sents = conll2000.chunked_sents('train.txt', chunk_types=['NP'])
chunker = ConsecutiveNPChunker(train_sents)
print(train_sents)
print(chunker.evaluate(test_sents))
