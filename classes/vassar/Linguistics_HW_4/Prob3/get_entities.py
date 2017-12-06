def get_entities (chunked_corpus)

from nltk.tree import Tree
for sent in chunked_corpus:
	for subtree in sent:
		if type(subtree) == Tree:
			ne_label = subtree.label()
			ne_string = " ".join([token for token, pos in subtree.leaves()])
			ne_in_sent.append((ne_string, ne_label))
return ne_in_sent