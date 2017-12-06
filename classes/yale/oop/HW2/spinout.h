#ifndef __SPINOUT_H__
#define __SPINOUT_H__

#include <string>

namespace cs427_527
{
class SpinOut
{
 public:
  SpinOut();
  SpinOut(const std::string& s);

  bool isLegalMove(int i) const;
  void makeMove(int i);
  int totalMoves() const;
  bool isSolved() const;
  void toCString(char *s) const;
  std::string toString() const;
  
  static const int SIZE = 7;
  static const char VCHAR = '/';
  static const char HCHAR = '-';
  enum Direction {vertical, horizontal};
  
 private:
  int moveCount;
  Direction pieces[SIZE];
};
}
#endif
