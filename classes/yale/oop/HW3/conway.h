#ifndef __CONWAY_H__
#define __CONWAY_H__

#include <iostream>
#include <string>

namespace cs427_527
{
  class Conway
  {
  public:
    Conway();
    Conway(std::istream& in);
    Conway(const Conway&);
    Conway(Conway&&);
    ~Conway();

    Conway& operator=(const Conway&);
    Conway& operator=(Conway&&);

    bool isLegalMove(int fromR, int fromC, int toR, int toC) const;
    void makeMove(int fromR, int fromC, int toR, int toC);
    int totalMoves() const;
    bool isSolved() const;
    std::string toString() const;
  
    static const char PIECE = 'X';
    static const char EMPTY = '.';
    enum Square {empty, piece};
  
 private:
    void deallocate();
    void deepCopy(const Conway&);
    void steal(Conway&);
    bool onBoard(int r, int c) const;
    bool validFrom(int r, int c) const;
    bool validTo(int r, int c) const;
    bool validDirection(int fromR, int fromC, int toR, int toC) const;
    bool validDistance(int fromR, int fromC, int toR, int toC) const;
    bool validJump(int fromR, int fromC, int toR, int toC) const;
    
    int moveCount;
    Square **board;
    int width;
    int height;
  };

  std::ostream& operator<<(std::ostream& os, const Conway& state);
}

#endif
