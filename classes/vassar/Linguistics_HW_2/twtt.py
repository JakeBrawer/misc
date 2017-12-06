# Imports
# #+NAME: imports

import sys
import csv
import re
import subprocess

sentiment_list = []
def testList(path):
    tweet_list = []
    f = open(path, 'rU')
    reader = csv.reader(f)
    for line in reader:
        tweet_list.append(line)
    return tweet_list




# [[file:twitter.org::*Clean%20tweet][cleanTweet]]

#Cleans up some of the junk in tweet
def cleanTweet(tweet):
    tweet = re.sub(r'\b\d\d\d\d\,', '', tweet)
    #Removes usr's name at the begining
    #tweet = re.sub(r'^\S+,', '', tweet)
    # This stuff replaces html characters with ASCII chars
    tweet = tweet.replace('&amp;', '&')
    tweet = tweet.replace('&quot;', '"')
    tweet = tweet.replace('gt;', '>')
    tweet = tweet.replace('lt;', '<')
    # deletes html tags
    #tweet = re.sub( r'\b<\S+>\b','',tweet)
    # deletes urls
    #tweet = re.sub( r'\b(http://|www\.)\S+\b','URL',tweet)
    #tweet = re.sub( r'\bwww.//\S+\b','',tweet)
    # Deletes emoticons and non alphanumerics
    # Gets rid of # and @[insert name]
    #tweet = re.sub( r'#','',tweet)
    #tweet = re.sub( r'@.+?\b','AT_USER',tweet)
    # Remove repeated chars > 2
    tweet = re.sub( r'(\w|[!?.])\1\1+',r'\1',tweet)
    # removes words that begin wih numbers
    tweet = re.sub( r'^\d+\S+\b','',tweet)
    return tweet
# cleanTweet ends here

# writes each cleaned tweet to a txt file
def writePreprocessedTweet(argsv):
    global sentiment_list
    # Will store each tweet (which will be its own list) 
    path = argsv[1]
    print path
    tweet_list =testList(path)
    with open('tweet_preprocessed.txt', 'w') as f:
        for tweet in tweet_list:
            tweet = ' '.join(tweet)
            split_tweet = tweet.split('\t')
            sentiment = split_tweet[0]
            cleaned_tweet = cleanTweet(split_tweet[1])
            #print cleaned_tweet
            f.write(cleaned_tweet+'\n')
            sentiment_list.append(sentiment)
            


# Runs the preprocessed tweets in ark, and then concats' each word w the pos tags
def tagTweets(argsv):
    global sentiment_list
    subprocess.call('./ark-tweet-nlp-0.3.2/runTagger.sh --model model.ritter_ptb_alldata_fixed.20130723.txt ./tweet_preprocessed.txt  > tweets_with_tags.txt  ', shell=True)
    with open('tweets_with_tags.txt', 'rU') as f, open(argsv[2], 'w') as o:
        index = 0
        for line  in f:
            # seperates tweets from pos tags from probs etc.
            #tweet = ' '.join(line)
            data = line.s plit('\t')
            #print sentiment
            # gets just the pos tags, a single string
            pos_tags = data[1:2]
            pos_tags = ','.join(pos_tags)
            pos_tags= pos_tags.split(' ')
            tweet = data[0:1]
            tweet = ','.join(tweet)
            tweet = tweet.split(' ')
            tweet_str = ''
            #There should always be equal numbers of tags and words
            #in a given tweet
            print len(tweet), len(pos_tags), len(sentiment_list)
            #Appends pos tag to word
            for i in range(len(tweet)):
                tweet_str= tweet_str+' '+tweet[i]+'_'+pos_tags[i]
            try:
                tweet_str = sentiment_list[index]+'\t'+tweet_str+'\n'
                print tweet_str
                index+= 1
                o.write(tweet_str)
            except IndexError:
                pass
writePreprocessedTweet(sys.argv)
tagTweets(sys.argv)



            
# [[file:twitter.org::*Write%20tweet%20to%20a%20csv][Write\ tweet\ to\ a\ csv:1]]
# Insert txt here
# Write\ tweet\ to\ a\ csv:1 ends here
