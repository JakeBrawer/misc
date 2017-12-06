#include <iostream>
#include <fstream>
#include <cstring>
#include <cstdlib>
#include <string>

#include "conway.h"

using cs427_527::Conway;

int main(int argc, char **argv)
{
  char *s = argv[0] + strlen(argv[0]) - 1;
  while (s > argv[0] && *(s - 1) != '/')
    {
      s--;
    }
  std::string exeName = s;
  
  try
    {
      bool interactive = (argc > 1 && strcmp(argv[1], "-i") == 0);
      
      int indexOfStartConfig = (interactive ? 2 : 1);
      int indexOfMove = indexOfStartConfig;
      
      Conway puzzle;
      if (indexOfStartConfig + 1 < argc && strcmp(argv[indexOfStartConfig], "-f") == 0)
	{
	  std::ifstream in(argv[indexOfStartConfig + 1]);
	  
	  puzzle = Conway(in);
	  indexOfMove += 2;
	}

      if (!interactive)
	{
	  int indexFirstMove = indexOfMove;
	  int fromR, fromC, toR, toC;
	  while (indexOfMove + 3 < argc &&
		 (fromR = atoi(argv[indexOfMove]),
		  fromC = atoi(argv[indexOfMove + 1]),
		  toR = atoi(argv[indexOfMove + 2]),
		  toC = atoi(argv[indexOfMove + 3]),
		  puzzle.isLegalMove(fromR, fromC, toR, toC)))
	    {
	      puzzle.makeMove(fromR, fromC, toR, toC);
	      indexOfMove += 4;
	    }
	  
	  if (indexOfMove + 3 < argc)
	    {
	      std::cout << exeName << ": illegal move "
			<< argv[indexOfMove] << " "
			<< argv[indexOfMove + 1] << " "
			<< argv[indexOfMove + 2] << " "
			<< argv[indexOfMove + 3]
			<< " in position "
			<< (indexOfMove - indexFirstMove) / 4 + 1
			<< " for " << std::endl
			<< puzzle;
	    }
	  else
	    {
	      if (puzzle.isSolved())
		{
		  std::cout << "SOLVED" << std::endl;
		}
	      else
		{
		  std::cout << puzzle;
		}
	    }
	}
      else
	{
	  std::cout << puzzle;

	  int fromR, fromC, toR, toC;
	  while (!puzzle.isSolved() && std::cin >> fromR >> fromC >> toR >> toC)
	    {
	      if (puzzle.isLegalMove(fromR, fromC, toR, toC))
		{
		  puzzle.makeMove(fromR, fromC, toR, toC);
		  
		  std::cout << puzzle;
		}
	      else
		{
		  std::cout << "illegal move" << std::endl;
		}
	    }
	  if (puzzle.isSolved())
	    {
	      std::cout << puzzle.totalMoves() << " moves" << std::endl;
	    }
	}
    }
  catch (const char *s)
    {
      std::cout << exeName << ": " << s << std::endl;
    }
}
