import learn_pcfg as pcfg
from nltk.corpus import treebank

three_trees = pcfg.three_trees
sentences = pcfg.sentences
sentence = "Jeff pronounced that Fred snored loudly"
def probA():
    print(pcfg.learn_trees(three_trees))

def ProbB():
    grammar = pcfg.learn_trees(three_trees)
    # calculates the top two parses and prints em
    parse = pcfg.prob_parse(grammar, sentence, 2)
    for i in parse:
        print(i)
        #i.draw()
ProbB()

def ProbD():
    grammar = pcfg.learn_treebank()
    # 27783 rules
    print(grammar)
