# _*_ coding:utf-8 _*_
import wikipedia as wiki
import nltk
from nltk.corpus import wordnet_ic
import csv
import re
import sys

# This is used for word sense disambiguation
brown_ic = wordnet_ic.ic('ic-brown.dat')

#This func exploits an invariant in wiki articles:
# That the first sentence of wiki articles generally
# type the subject of the article
def processes_first_sent(sent):
    #Gets rid of parantheticals, which usually are unimportant
    sent = re.sub(r'\(.*?\)', '', sent )
    sent = nltk.word_tokenize(sent)
    sent = nltk.pos_tag(sent)
    #sent = [ (a,b) for (a,b) in sent if b != r'NN.*']
    # Stores  list of verbs
    verb_list = ['is', 'are', 'was', 'were']
    verb_bool = False
    # This will store the final sentance
    sent_list = []
    # We are only interested in the explanatory part of the sentence (if it exists)
    # i.e. "is the current President of the United States."
    for i in range(len(sent)):
        # It seems like if a verb comes after a verb, the most explanatory word is
        # probably in the title of the article.
        if sent[i][0] in verb_list:
            if sent[i+1][1] == 'DT':
                verb_bool = True
        if verb_bool:
            sent_list.append(sent[i])
    if not verb_list: return False
    else: return sent_list


# This extracts the most explanatory noun from the first sentence of a
# given Wikipedia article, i.e. the noun that will be most useful for
# classifying the article
def get_ne(article):
    # If the link doesnt work, there isnt
    # much we can do 
    try:sent = wiki.summary(article,1)
    except wiki.exceptions.PageError:  return
    processed_sent = processes_first_sent(sent)
    # This grammar is structures in such a way s.t.
    # the target noun is always the word in the tree
    grammar = r"""NP:
    {<DT|CD><.*>*?<NN.*>+(<IN><V.+|JJ>*?<NN[S]*>|<JJ>+<NN|NNS>|<CC><.*>*?<NN>+)?}"""
    # This deals with the case when the target noun is in the
    # title of the article
    if not(processed_sent):
        processed_sent = nltk.word_tokenize(article)
        # This is so that pos tagger doesnt assume
        # first word is an NNP (though it might be!)
        processed_sent[0] = processed_sent[0].lower()
        processed_sent = nltk.pos_tag(processed_sent)
    # This stuff attempts to extract the target noun
    # from the chunked sentence
    cp = nltk.RegexpParser(grammar)
    result = cp.parse(processed_sent)
    for i in result.subtrees():
        if i.label() == 'NP':
            #print(i)
            NP = nltk.chunk.tree2conllstr(i).split('\n')
            best_noun = NP[-1]
            best_noun = best_noun.split(' ')[0]
            return best_noun, nltk.word_tokenize(sent)
    # This stuff is all very heuristical and likely wrong.
    # Essentially we are trying to extract the most informative
    # word from the title. The problem is titles are usually
    # sentence fragments and may contain a ton of proper nouns
    # so are difficult to parse.
    nouns = [a for (a,b) in processed_sent if re.match(r'NN\b|NNS\b', b)]
    if not(nouns):
        # This assumes that if there are a string of consecutive NNPs
        # the last one is actually the informative one
        # 'e,g, United States Census'
        try:
            nouns = [a for (a,b) in processed_sent if 'NN' in b]
            print('BEST NOUN', nouns[-1])
            assert not isinstance(nouns[-1], list)
            return nouns[-1], nltk.word_tokenize(sent)
        except IndexError:
            #nouns = [()b for (a,b) in nltk.pos_tag(nltk.word_tokenize(article))]
            return 'UNKNOWN', None
    else:
        return nouns[-1], nltk.word_tokenize(sent)
        
    return nouns, nltk.word_tokenize(sent)


# This function takes an article as input
# and attempts to classify all the hyperlinks
# therein
def type_article(article):
    NE,sent = get_ne(article)
    if isinstance(NE,list):
        NE = NE[0]
        print('NEW NE:', NE)
    # I chose the senses manually. They seemd the most general, and
    # make the mose sense
    NE_types = [wn.synset('organization.n.01'), wn.synset('person.n.01'),
                wn.synset('location.n.01'), wn.synset('date.n.06'),
                wn.synset('time.n.01'),
                wn.synset('money.n.01'), wn.synset('facility.n.01'),
                wn.synset('concept.n.01'),wn.synset('animal.n.01'),
                wn.synset('event.n.01'),wn.synset('medium.n.01'),
                wn.synset('structure.n.01'), wn.synset('vehicle.n.01'),
                wn.synset('feature.n.01'), wn.synset('plant.n.02'),
                wn.synset('tool.n.01')]
    max_similarity = (0,0)
    # get a list of all noun synsets for target noun
    NE_synsets = wn.synsets(NE, pos='n')
    # compares semantic similarity of each of these
    # synsets to the category synsets and choses the
    # one with the highest similarity
    for type in NE_types:
        for i in NE_synsets:
        # based on least common subsummer
        # seems more accurate than Resnik
            sim= type.lin_similarity (i ,brown_ic)
            if sim > max_similarity[1]:
                max_similarity = type,sim
    try:
        type = max_similarity[0].name().split('.')[0].replace('_', ' ')
        max_similarity = type,max_similarity[1]
        return max_similarity
    except AttributeError:
        print('ERROR: ', max_similarity[0])
        return 'UNKOWN'

# This is the function I used to evaluate the functions above
# writes the results of type_article for n number of articles
# to a csv 
def write_article_links_to_csv(num_articles, outfile):
    with open(outfile,'w' ) as f:
        wr = csv.writer(f, dialect='excel')
        for rand in wiki.random(pages=num_articles):
            try:
                page = wiki.WikipediaPage(rand)
                best_noun, sent = get_ne(rand)
                type = type_article(rand)[0]
                try: f.write('ARTICLE: %s  Best Noun: %s   TYPE:  %s\n' %\
                             (rand,best_noun,type))
                except UnicodeEncodeError: print('UNICODE ERROR, PASSING')
            except wiki.exceptions.DisambiguationError:
                 f.write('Article: %s\n' % rand)
            f.write('--LINKS:\n')
            try:
                for link in page.links:
                    print(wiki.summary(link, 1).encode('utf-8'))
                    best_noun, sent = get_ne(link)
                    type = type_article(link)[0]
                    try:wr.writerow([link, best_noun, type])
                    except UnicodeEncodeError:pass
            # There isnt much I can do about these errors
            # other than ignore the links causing them
            except wiki.exceptions.DisambiguationError:print('AMBIGUOUS PAGE: pass')
            except wiki.exceptions.PageError: print('PAGE ERROR: pass')
            except TypeError: print('TYPE ERR')
            f.write('Total num of links: %\ns' % len(page.links))
            f.write('================================================\n')


write_article_links_to_csv(sys.argv[1], sys.argv[2])


