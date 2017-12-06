from nltk.tree import Tree

##
## Extracts named entities to a list of strings of the form
##       LOCATION Asia
##       LOCATION Avenida da Amizade
##
## Parameters:
##      tree : a tree as created by nltk's chunked_sent function
##      entities : a list of strings representing the entity names to extract
##

def extract(tree, entities):

    named_entities = []

    for child in tree:
        if isinstance(child, Tree):
            for subtree in child.subtrees():
                if subtree.label() in entities:
                    entity= subtree.label() + " " + " ".join(str(leaf[0]) for leaf in subtree.leaves())
                    named_entitites = named_entities.append(entity)
    return named_entities
