import nltk
import re

sent = "if owns person box true and box red then collect false"
sent = sent.split()
tok_sent = nltk.pos_tag(sent)
grammar = r"""
   PREDS: {<.*>+}
          }<RB|IN|CC>{
"""
cp = nltk.RegexpParser(grammar)
result = cp.parse(tok_sent)
preds = []
action = []
print(result)
for i in result.subtrees():
    if i.label() == 'PREDS':
        chunks = nltk.chunk.tree2conlltags(i)
        pred = [p[0] for p in chunks ]
        preds.append(pred)
action = preds.pop()
print (preds)
print(action)

# grammar = r"""NP:
# NP: {<IN><.*>+<RB>}
# {<DT|CD><.*>*?<NN.*>+(<IN><V.+|JJ>*?<NN[S]*>|<JJ>+<NN|NNS>|<CC><.*>*?<NN>+)?}"""
