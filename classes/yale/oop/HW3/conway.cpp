#include <string>
#include <iostream>
#include <sstream>
#include <iomanip>

#include "conway.h"

namespace cs427_527
{
  Conway::Conway()
  {
    moveCount = 0;

    width = 6;
    height = 5;

    board = new Square *[height];
    for (int r = 0; r < height; r++)
      {
	board[r] = new Square[width];
	for (int c = 0; c < width; c++)
	  {
	    board[r][c] = empty;
	  }
      }

    board[2][1] = piece;
    board[2][2] = piece;
    board[2][3] = piece;
    board[3][3] = piece;
  }

  Conway::Conway(std::istream& in)
  {
    moveCount = 0;

    in >> width >> height >> std::ws;

    if (!in)
      {
	throw "error reading configuration file";
      }

    if (width <= 0 || height <= 0)
      {
	throw "bad size in configuration file ";
      }

    board = new Square *[height];
    for (int r = 0; r < height; r++)
      {
	std::string line;
	std::getline(in, line);

	if ((int)line.size() != width)
	  {
	    throw "bad configuration " + line;
	  }
	
	board[r] = new Square[width];
	for (int c = 0; c < width; c++)
	  {
	    board[r][c] = line[c] == PIECE ? piece : empty;
	  }
      }

    if (!in)
      {
	throw "error reading row in configuration file";
      }
  }

  Conway::Conway(const Conway& toCopy)
  {
    deepCopy(toCopy);
  }

  Conway::Conway(Conway&& toMove)
  {
    steal(toMove);
  }

  Conway::~Conway()
  {
    deallocate();
  }

  Conway& Conway::operator=(const Conway& rhs)
  {
    if (this != &rhs)
      {
	deallocate();
	deepCopy(rhs);
      }

    return *this;
  }

  Conway& Conway::operator=(Conway&& rhs)
  {
    if (this != &rhs)
      {
	deallocate();
	steal(rhs);
      }

    return *this;
  }

  void Conway::deallocate()
  {
    for (int r = 0; r < height; r++)
      {
	delete[] board[r];
      }
    delete[] board;
  }

  void Conway::deepCopy(const Conway& toCopy)
  {
    width = toCopy.width;
    height = toCopy.height;
    moveCount = toCopy.moveCount;

    board = new Square *[height];
    for (int r = 0; r < height; r++)
      {
	board[r] = new Square[width];
	for (int c = 0; c < width; c++)
	  {
	    board[r][c] = toCopy.board[r][c];
	  }
      }
  }

  void Conway::steal(Conway& toMove)
  {
    width = toMove.width;
    height = toMove.height;
    moveCount = toMove.moveCount;
    board = toMove.board;

    toMove.width = 0;
    toMove.height = 0;
    toMove.moveCount = 0;
    toMove.board = nullptr;
  }

  bool Conway::isLegalMove(int fromR, int fromC, int toR, int toC) const
  {
    return (onBoard(fromR, fromC)
	    && onBoard(toR, toC)
	    && validFrom(fromR, fromC)
	    && validTo(toR, toC)
	    && validDirection(fromR, fromC, toR, toC)
	    && validDistance(fromR, fromC, toR, toC)
	    && validJump(fromR, fromC, toR, toC));
  }

  bool Conway::onBoard(int r, int c) const
  {
    return (r >= 0 && r < height && c >= 0 && c < width);
  }

  bool Conway::validFrom(int r, int c) const
  {
    return board[r][c] == piece;
  }

  bool Conway::validTo(int r, int c) const
  {
    return board[r][c] == empty;
  }

  bool Conway::validDirection(int fromR, int fromC, int toR, int toC) const
  {
    return fromR == toR || fromC == toC;
  }

  bool Conway::validDistance(int fromR, int fromC, int toR, int toC) const
  {
    return abs(fromR - toR) + abs(fromC - toC) == 2;
  }
 
  bool Conway::validJump(int fromR, int fromC, int toR, int toC) const
  {
    return board[(fromR + toR) / 2][(fromC + toC) / 2] == piece;
  }

  void Conway::makeMove(int fromR, int fromC, int toR, int toC)
  {
    if (!isLegalMove(fromR, fromC, toR, toC))
      {
	throw "illegal move";
      }
    
    board[toR][toC] = board[fromR][fromC];
    board[fromR][fromC] = empty;
    board[(toR + fromR) / 2][(toC + fromC) / 2] = empty;
    
    moveCount++;
  }

  int Conway::totalMoves() const
  {
    return moveCount;
  }

  bool Conway::isSolved() const
  {
    int c = 0;
    while (c < width && board[0][c] == empty)
      {
	c++;
      }
    return (c < width);
  }

  std::string Conway::toString() const
  {
    std::ostringstream out;

    for (int r = 0; r < height; r++)
      {
	for (int c = 0; c < width; c++)
	  {
	    out << (board[r][c] == piece ? PIECE : EMPTY);
	  }
	out << std::endl;
      }

    return out.str();
  }
  
  std::ostream& operator<<(std::ostream& os, const Conway& state)
  {
    return os << state.toString();
  }

}
