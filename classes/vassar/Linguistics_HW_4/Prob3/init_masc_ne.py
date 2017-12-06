import nltk
from nltk.corpus import ConllChunkCorpusReader

from nltk.corpus.reader.tagged import TaggedCorpusReader
root = '/usr/local/share/nltk_data/corpora/MASC-for-NE/'
masc_for_ne = TaggedCorpusReader(root,'.*', '_')

sents = masc_for_ne.tagged_sents()
ne_sents = [nltk.ne_chunk(sent) for sent in sents]

root = "/usr/local/share/nltk_data/corpora/masc_conll/"
gold_corpus = ConllChunkCorpusReader(root,r".*\.conll", chunk_types=("DATE","PERSON","ORGANIZATION","LOCATION"))
gold_sents = gold_corpus.chunked_sents()

