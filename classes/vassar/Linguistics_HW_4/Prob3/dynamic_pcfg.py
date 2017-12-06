import nltk.data
from nltk.grammar import *
from nltk.tree import ProbabilisticTree

def best_parse(grammar, sentence, trace=0):
    words = sentence.split()
    table, splits = parse_table(grammar, words, trace)
    return make_tree(table, splits, 0, len(words), grammar.start())


def make_tree(table, splits, left, right, nonterminal):
    if isinstance(nonterminal, str):
        # actually a terminal -- we're done
        return nonterminal

    try:
        leftsym, rightsym, split = splits[left, right, nonterminal]
        prob = table[left, right, nonterminal]
    except KeyError:
        return None

    if rightsym is None:
        # unary production
        tree = make_tree(table, splits, left, right, leftsym)
        return ProbabilisticTree(nonterminal.symbol(), [tree], prob=prob)

    else:
        left_tree = make_tree(table, splits, left, split, leftsym)
        right_tree = make_tree(table, splits, split, right, rightsym)
        return ProbabilisticTree(nonterminal.symbol(), [left_tree, right_tree],
                                 prob=prob)

def parse_table(grammar, words, trace=0):
    table = {}
    splits = {}
    n = len(words)
    
    proddict = {}
    
    # base case
    for prod in grammar.productions():
        lhs = prod.lhs()
        rhs = prod.rhs()
        # store this production in a lookup dictionary
        proddict.setdefault(lhs, set()).add(prod)
    
    for i in range(n):
        for prod in grammar.productions():
            lhs = prod.lhs()
            rhs = prod.rhs()
        
            if isinstance(rhs[0], str):
                if words[i] == rhs[0]:
                    table[i, i+1, lhs] = prod.prob()
                    splits[i, i+1, lhs] = (words[i], None, None)
                    if trace > 0:
                        display_prod(i, i+1, n, lhs, rhs, prod.prob())
    
    # main loop
    total = 0
    for length in range(2, n+1):
        for left in range(n-length+1):
            right = left+length
            for lhs in proddict:
                best = 0
                for prod in proddict.get(lhs, set()):
                    rhs = prod.rhs()
                    if len(rhs) == 2:
                        for s in range(left+1, right): # split point
                            l, m = rhs
                            prob = (prod.prob() * table.get((left, s, l), 0)
                                                * table.get((s, right, m), 0))
                            if prob > best:
                                best = prob
                                splits[left, right, lhs] = (l, m, s)
                                if trace > 0:
                                    display_prod(left, right, n, lhs, rhs, prod.prob())
                    
                    elif len(rhs) == 1:
                        # handle unary productions
                        m = rhs[0]
                        prob = (prod.prob() * table.get((left, right, m), 0))
                        if prob > best:
                            best = prob
                            splits[left, right, lhs] = (m, None, None)
                            if trace > 0:
                                display_prod(left, right, n, lhs, rhs, prod.prob())
                    
                table[left, right, lhs] = best
                
    return table, splits

def display_prod(left, right, n, lhs, rhs, prob):
    wp = ProbabilisticProduction(lhs, rhs, prob=prob)
    print ( '|' + '.'*left + '='*(right-left) + '.'*(n-right) + '|', wp )

def demo():
    # grammar toy.pcfg at bottom of file
    simple_grammar = nltk.data.load('/usr/local/share/nltk_data/grammars/sample_grammars/toy.pcfg')
    print ( best_parse(simple_grammar, 'I saw John with my telescope', trace=1) )

if __name__ == '__main__':
    demo()


#############################################################################################
#############################      toy.pcfg grammar     #####################################
#############################################################################################
##
### Grammatical productions.
##S -> NP VP [1.0]
##NP -> Pro [0.1] | Det N [0.3] | N [0.5] | NP PP [0.1]
##VP -> Vi [0.05] | Vt NP [0.9] | VP PP [0.05]
##Det -> Art [1.0]
##PP -> Prep NP [1.0]
### Lexical productions.
##Pro -> "i" [0.3] | "we" [0.1] | "you" [0.1] | "he" [0.3] | "she" [0.2]
##Art -> "a" [0.4] | "an" [0.1] | "the" [0.5]
##Prep -> "with" [0.7] | "in" [0.3]
##N -> "salad" [0.4] | "fork" [0.3] | "mushrooms" [0.3]
##Vi -> "sneezed" [0.6] | "ran" [0.4]
##Vt -> "eat" [0.2] | "eats" [0.2] | "ate" [0.2] | "see" [0.2] | "saw" [0.2]

