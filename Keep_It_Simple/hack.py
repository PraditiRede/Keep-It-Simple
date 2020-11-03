import eel
import bs4 as bs
import urllib.request
import re
import heapq
import nltk
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')
from nltk.stem import WordNetLemmatizer

eel.init('Keep_It_Simple')
@eel.expose


def s(a): # variable a load the text content from javascript file
    lemmatizer = WordNetLemmatizer() # lemmatizes the words eg. work and working are consideres as one word
    article_text = a 
    article_text = re.sub(r'\[[0-9]*\]', ' ', article_text)
    article_text = re.sub(r'\s+', ' ', article_text) # Clear the text, remove numbers and special characters
    formatted_article_text = re.sub('[^a-zA-Z]', ' ', article_text )
    formatted_article_text = re.sub(r'\s+', ' ', formatted_article_text) # Make the whole text to lowercase
    sentence_list = nltk.sent_tokenize(article_text) # Separate the sentences from the paragraph

    stopwords = nltk.corpus.stopwords.words('english')

    #Find the frequency of words
    word_frequencies = {}
    for word in nltk.word_tokenize(formatted_article_text):
        word = word.lower()
        word = lemmatizer.lemmatize(word)
        if word not in stopwords:
            if word not in word_frequencies.keys():
                word_frequencies[word] = 1
            else:
                word_frequencies[word] += 1
        else:
        word_frequencies[word]=0
    maximum_frequncy = max(word_frequencies.values())

    # Find the frequency of sentences
    for word in word_frequencies.keys():
        word_frequencies[word] = (word_frequencies[word]/maximum_frequncy)
    sentence_scores = {}
    for sent in sentence_list:
        for word in nltk.word_tokenize(sent.lower()):
            if word in word_frequencies.keys():
                if len(sent.split(' ')) < 100:
                    if sent not in sentence_scores.keys():
                        sentence_scores[sent] = word_frequencies[word]
                    else:
                        sentence_scores[sent] += word_frequencies[word]

    # Sort the sentences in desending order of frequency
    sentence_list.sort() 

    summary_sentences = heapq.nlargest(100, sentence_scores, key=sentence_scores.get)

    summary = ' '.join(summary_sentences) # Summarized paragraph is stored in summary
    return summary # return summarized paragraph to javascript
eel.start('popup.html', size(300,200))