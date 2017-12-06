import re

sentence = 'Is a book from Star Trek: The Next Generation series'
regex = r'([A-Z][a-z]{1,2}\.\s+(?:[A-Z][a-z]+\s*)*|(?<!\. )(?<!;)(?:[A-Z][a-z]+\s*)+)'
old_regex = r'(?:\s+\b([A-Z][a-z]+)\b)+[\;\:]?'

sent = re.sub(regex, ' TITLE', sentence)
print(sent)
