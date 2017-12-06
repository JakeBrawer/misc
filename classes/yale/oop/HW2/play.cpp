#include <iostream>
#include <cstring>
#include <cstdlib>
#include <string>

#include "spinout.h"


using cs427_527::SpinOut;

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
      
      SpinOut puzzle;
      if (indexOfStartConfig < argc && (argv[indexOfStartConfig][0] == SpinOut::VCHAR
					|| argv[indexOfStartConfig][0] == SpinOut::HCHAR))
	{
	  puzzle = SpinOut(argv[indexOfStartConfig]);
	  indexOfMove++;
	}

      if (!interactive)
	{
	  int indexFirstMove = indexOfMove;
	  int move;
	  while (indexOfMove < argc && (move = atoi(argv[indexOfMove]), puzzle.isLegalMove(move)))
	    {
	      puzzle.makeMove(move);
	      indexOfMove++;
	    }
	  if (indexOfMove < argc)
	    {
	      std::cout << exeName << ": illegal move " << argv[indexOfMove] << " in position " << (indexOfMove - indexFirstMove + 1) << " for " << puzzle.toString() << std::endl;
	    }
	  else
	    {
	      if (puzzle.isSolved())
		{
		  std::cout << "SOLVED" << std::endl;
		}
	      else
		{
		  char buf[SpinOut::SIZE + 1];
		  puzzle.toCString(buf);
		  std::cout << buf << std::endl;
		}
	    }
	}
      else
	{
	  char buf[SpinOut::SIZE + 1];
	  puzzle.toCString(buf);
	  std::cout << buf << std::endl;

	  int move;
	  while (!puzzle.isSolved() && std::cin >> move)
	    {
	      if (puzzle.isLegalMove(move))
		{
		  puzzle.makeMove(move);
		  
		  puzzle.toCString(buf);
		  std::cout << buf << std::endl;
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
