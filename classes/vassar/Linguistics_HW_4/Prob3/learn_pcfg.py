import nltk
from nltk import *
from nltk.corpus import treebank
from nltk.treetransforms import *

"""
This file contains some useful utilities for probabilistic parsing.
"""

# Three parse trees that you'll use for the assignment.
# JAKE EDITS: removed the extra VP that surrounded some of the verbs.
# This seems to have gotten rid of the weird parse
three_trees = [Tree.fromstring(t, remove_empty_top_bracketing=True)  for t in
['''(S (NP John) (VP (V1 said) (SBAR (COMP that)
(S (NP Sally) (VP  (V2 snored) (ADVP loudly)))))(. .))''',
'''(S (NP Sally) (VP (V1 declared) (SBAR (COMP that)
(S (NP Bill) (VP  (V2 ran) (ADVP quickly)))))(. .))''',
'''(S (NP Fred) (VP (V1 pronounced) (SBAR (COMP that)
(S (NP Jeff) (VP  (V2 swam) (ADVP elegantly)))))(. .))''']]

sentences = [
'''The luxury auto maker last year sold 1,000 cars in the U.S.''',
'''Bell Industries Inc. increased its quarterly to 10 cents from seven cents
a share .''',
'''The dispute shows clearly the global power of Japan 's financial titans .''',
'''Was this why some of the audience departed before or during the second
half ?'''
]

def learn_treebank(trees=None):
    """
    Learn a PCFG from the Penn Treebank, and return it.
    
    By default, this learns from NLTK's 10% sample of the Penn Treebank.
    You can also pass a set of trees.
    """
    if trees is None: bank = treebank.parsed_sents()
    else: bank = trees
    return learn_trees(bank, collapse=True)

def learn_trees(trees, collapse=True):
    """
    Given a list of parsed sentences, return the maximum likelihood PCFG
    for those sentences.

    If 'collapse' is True, it will collapse the trees before learning the
    grammar so that there are no unary productions.

    This will reduce productions of length more than 2 using Chomsky normal
    form. 
    """
    productions = []
    for tree in trees:
      if collapse: tree.collapse_unary(collapsePOS=False)
      tree.chomsky_normal_form()
      productions += tree.productions()

    grammar = nltk.grammar.induce_pcfg(Nonterminal('S'), productions)
    return grammar

def prob_parse(grammar, sentence, n=1):
    """
    Return the n most likely parses (default 1) for a sentence, given a PCFG.

    If n=1, this will use Viterbi (A*) parsing for efficiency.

    If the grammar was trained on trees in Chomsky normal form, this function
    will un-Chomsky the trees before outputting them.
    """
    words = sentence.split()
    if n == 1:
        parses = [dynamic_pcfg.best_parse(grammar, sentence, trace=2)]
    else:
        parser = InsideChartParser(grammar, trace=2)
        parses = parser.parse(words)
# Include next statement if grammar was trained on trees in Chomsky NO\ormal Form:
#    for parse in parses: print(un_chomsky_normal_form(parse))
    return parses

def change_start(grammar, newstart):
    """
    Return a new grammar with a different start symbol. This can be useful
    for parsing a single noun phrase instead of a complete sentence, for
    example.
    """
    if isinstance(newstart, str): newstart=Nonterminal(newstart)
    return Grammar(newstart, grammar.productions())


