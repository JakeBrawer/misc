#include <cstring>

#include "spinout.h"

namespace cs427_527
{
SpinOut::SpinOut()
{
  moveCount = 0;
  
  for (int i = 0; i < SIZE; i++)
    {
      pieces[i] = vertical;
    }
}

  SpinOut::SpinOut(const std::string& s)
{
  if (s.length() != SIZE)
    {
      throw "invalid initializer length";
    }

  moveCount = 0;

  for (int i = 0; i < SIZE; i++)
    {
      if (s[i] == VCHAR)
	{
	  pieces[i] = vertical;
	}
      else if (s[i] == HCHAR)
	{
	  pieces[i] = horizontal;
	}
      else
	{
	  throw "invalid character in initializer";
	}
    }
}

bool SpinOut::isLegalMove(int i) const
{
  if (i < 0 || i >= SIZE)
    {
      return false;
    }

  if (i == SIZE - 1)
    {
      return true;
    }
  else if (pieces[i + 1] == horizontal)
    {
      return false;
    }
  else
    {
      int right = i + 2;
      while (right < SIZE && pieces[right] == horizontal)
	{
	  right++;
	}
      return (right == SIZE);
    }
}

void SpinOut::makeMove(int i)
{
  if (!isLegalMove(i))
    {
      throw "illegal move";
    }

  pieces[i] = (pieces[i] == horizontal ? vertical : horizontal);
  moveCount++;
}

int SpinOut::totalMoves() const
{
  return moveCount;
}

bool SpinOut::isSolved() const
{
  int i = 0;
  while (i < SIZE && pieces[i] == horizontal)
    {
      i++;
    }
  return (i == SIZE);
}

void SpinOut::toCString(char *s) const
{
  int i;
  for (i = 0; i < SIZE; i++)
    {
      s[i] = (pieces[i] == vertical ? VCHAR : HCHAR);
    }
  s[i] = '\0';
}

std::string SpinOut::toString() const
{
  char buf[8];
  toCString(buf);
  return buf;
}


}
