#include <iostream>
#include <iomanip>

#include <vector>

#include "cooccur.h"

int main(int argc, char **argv)
{
  std::vector<std::string> keys;
  for (int a = 1; a < argc; a++)
    {
      keys.push_back(argv[a]);
    }
  
  CooccurrenceMatrix<std::string> matrix(keys);

  while (std::cin)
    {
      matrix.update(matrix.readContext(std::cin));
    }

  for (int a = 1; a < argc; a++)
    {
      std::cout << argv[a] << ": [";
      std::vector<double> row = matrix.getVector(std::string(argv[a]));
      for (size_t i = 0; i < row.size(); i++)
	{
	  if (i > 0)
	    {
	      std::cout << ", ";
	    }
	  std::cout << std::fixed << std::setprecision(6) << row[i];
	}
      std::cout << "]" << std::endl;
    }
}
