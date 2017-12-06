#include <iostream>

#include <unordered_map>
#include <vector>
#include <unordered_set>

#include <cctype>

template<typename T>
CooccurrenceMatrix<T>::CooccurrenceMatrix(std::vector<T> k)
  : keywords(k)
{
  for (auto i = k.begin(); i != k.end(); i++)
    {
      indices[*i] = i - k.begin();

      matrix[*i] = std::unordered_map<T, int>();
      for (auto j = k.begin(); j != k.end(); j++)
	{
	  matrix[*i][*j] = 0;
	}
    }
}

template<typename T>
std::unordered_set<T> CooccurrenceMatrix<T>::readContext(std::istream& is) const
{
  std::unordered_set<T> context;

  do
    {
      while (std::isspace(is.peek()) && is.peek() != '\n')
	{
	  is.get();
	}
      
      if (is.peek() != '\n')
	{
	  T word;
	  if (is >> word)
	    {
	      if (matrix.count(word) > 0)
		{
		  context.insert(word);
		}
	    }
	}
    }
  while (is && is.peek() != '\n');

  if (is)
    {
      is.get();
    }

  return context;
}

template<typename T>
void CooccurrenceMatrix<T>::update(const std::unordered_set<T>& context)
{
  for (auto i = context.begin(); i != context.end(); i++)
    {
      for (auto j = context.begin(); j != context.end(); j++)
	{
	  matrix[*i][*j]++;
	}
    }
}

template<typename T>
std::vector<double> CooccurrenceMatrix<T>::getVector(const T& keyword) const
{
  std::vector<double> row(keywords.size(), 0.0);

  if (indices.count(keyword) != 0)
    {
      if (matrix.at(keyword).at(keyword) != 0)
	{
	  for (auto i = keywords.begin(); i != keywords.end(); i++)
	    {
	      row[i - keywords.begin()] = (double)matrix.at(keyword).at(*i) / matrix.at(keyword).at(keyword);
	    }
	}
    }
  
  return row;
}
