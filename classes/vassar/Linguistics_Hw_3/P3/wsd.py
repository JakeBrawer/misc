from nltk.corpus import wordnet as wn
from nltk.corpus import wordnet_ic
from nltk.corpus.reader.wordnet import information_content
import resnik_similarity as rs
import sys


# A helper function
# Returns the index of largest value in a list
def returnMaxIndex(list):
    max = 0
    max_index = 0
    for i in range(len(list)):
        if list[i] > max:
            max = list[i]
            max_index = i
    return max_index


def wsd(icf, wsd_test_file,outfile):
    with open(wsd_test_file ,'r') as f, open(outfile,'w') as o:
        # Keeps track of which line of test_file we are looking at
        # for easy viewing later
        line_num = 0
        # Iterate through each line
        for line in f:
            line_num+= 1
            # a vector of all MISs for a given line
            mis_vec = []
            # a vector of corresponding similarity values
            sim_vec =[]
            # a vector of hypernyms of probe
            probe_sense_vec = []
            # a vector of corresponding probabilities for each hypernym
            prob_senses=[]
            # Preprocesses each line for easy manipualtion
            line= line.strip()
            line =line.split('\t')
            # Seperates the probe from context words
            (probe,context) = line 
            context = context.split(',')
            # For each word in context
            for c in context:
                # Calculate the resniksim of probe with c
                res_sim = rs.resnik_similarity(probe,c,icf)
                # append results to corresponding vectors
                sim_vec.append(res_sim[1])
                mis_vec.append(res_sim[0])
                #print(mis_vec)
                # write to outfile
                o.write('Probe: %s, Context: %s, Similarity: %s\n' % (probe, c, res_sim[0]))
            # creates a vector of all hypernyms
            probe_sense_vec = wn.synsets(probe)
            # Since these values correspond they have to be the
            # same size
            prob_senses= [0 for i in probe_sense_vec]
            # for each sense of the probe
            for sense in range(len(probe_sense_vec)):
                # look at all the most informative senses
                for mi in range(0,len(mis_vec)):
                    hyper = lambda s: s.hypernyms()
                    ancestors =set(probe_sense_vec[sense].closure(hyper))
                    # if an MIS is an ancestor of the probe
                    if mis_vec[mi] in ancestors:
                        # increment the probability by the MIS val
                        prob_senses[sense] += sim_vec[mi]
            index = returnMaxIndex(prob_senses)
            try:
                #print(probe_sense_vec)
                o.write('%s PREFERRED SENSE: %s\n' % (line_num, probe_sense_vec[index]))
                pass
            except IndexError:
                o.write('ERROR: NO SIMILARITY\n')
brown_ic = wordnet_ic.ic('/home/jake/nltk_data/corpora/wordnet_ic/ic-brown-add1.dat')

wsd(sys.argv[1], sys.argv[2], sys.argv[3])

