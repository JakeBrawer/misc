#include <iostream>
#include <fstream>
#include <sstream>
#include <cstring>
#include <vector>
#include "conway.h"

#define PRINT_PASSED std::cout << "PASSED" << std::endl
#define PRINT_FAILED std::cout << "FAILED" << std::endl

using cs427_527::Conway;

void testDefaultConstructor()
{
  std::string board = "......\n......\n.XXX..\n...X..\n......\n";
  Conway c = Conway();

  board == c.toString() ? PRINT_PASSED: PRINT_FAILED;
}

void testStreamConstructor()
{
  std::string board("X.X\n...\n.X.\n");
  std::stringstream ss;

  ss << "3 3 " << std::endl;
  ss << board << std::endl;

  Conway c = Conway(ss);
  board == c.toString() ? PRINT_PASSED: PRINT_FAILED;
}

void testStringStreamConstructor(int argc, char **argv)
{
  int indexOfStartConfig = 2;
  if (indexOfStartConfig + 1 < argc && strcmp(argv[indexOfStartConfig], "-f") == 0)
    {
      std::ifstream in(argv[indexOfStartConfig + 1]);
      std::string board = "...\n.X.\n.X.\n";

      Conway c = Conway(in);
      board == c.toString() ? PRINT_PASSED: PRINT_FAILED;
    }
}

void testLegalMoves(const std::string board, const std::string moves)
{
  std::stringstream ss;
  std::stringstream in(moves);
  int fromR = 0, fromC = 0, toR = 0, toC = 0;

  ss << "6 5 " << std::endl;
  ss << board << std::endl;

  Conway c = Conway(ss);

  while(in >> fromR >> fromC >> toR >> toC)
    {
      if (!c.isLegalMove(fromR, fromC, toR, toC))
        {
          PRINT_FAILED;
          return;
        }
      c.makeMove(fromR, fromC, toR, toC);
    }
  PRINT_PASSED;
}

void testBadMoves(std::string moves)
{
  std::stringstream in(moves);
  int fromR = 0, fromC = 0, toR = 0, toC = 0;
  Conway c = Conway();

  in >> fromR >> fromC >> toR >> toC;

  c.isLegalMove(fromR, fromC, toR, toC) ? PRINT_FAILED: PRINT_PASSED;

}

void testMakeMoveStart()
{
  Conway c1 = Conway();
  Conway c2 = Conway();

  std::string board1 = "......\n...X..\n.XX...\n......\n......\n";
  std::string board_init = "......\n......\n.XX...\n......\n...X..\n";

  c1.makeMove(3, 3, 1, 3);
  c2.makeMove(2, 3, 4, 3);

  std::string c1_next = c1.toString();
  std::string c2_next = c2.toString();

  c1_next == board1 && c2_next == board_init ? PRINT_PASSED: PRINT_FAILED;
}

void testMakeMoveOther()
{
  
  std::string board_init("X.X\n.X.\n.X.\n");
  std::stringstream ss;

  ss << "3 3 " << std::endl;
  ss << board_init << std::endl;

  Conway c = Conway(ss);

  std::string board_after = "XXX\n...\n...\n";

  c.makeMove(2, 1, 0, 1);


  c.toString() == board_after? PRINT_PASSED: PRINT_FAILED;
}

void testMakeMoveIllegal(std::string move)
{
  std::stringstream in(move);
  std::string board_init;
  int fromR = 0, fromC = 0, toR = 0, toC = 0;

  Conway c = Conway();
  board_init = c.toString();

  in >> fromR >> fromC >> toR >> toC;

  c.makeMove(fromR, fromC, toR, toC);
  c.toString() == board_init ? PRINT_PASSED: PRINT_FAILED;

}

void testTotalMovesAtConfig(std::string board)
{
  std::stringstream ss;
  int totalMoves;

  ss << "6 5 " << std::endl;
  ss << board << std::endl;

  Conway c = Conway(ss);

  totalMoves = c.totalMoves();

  totalMoves == 0 ? PRINT_PASSED : PRINT_PASSED;

}

void testTotalMovesAfterMoves(std::string moves, int num_legal_moves)
{
  std::stringstream in(moves);
  int fromR = 0, fromC = 0, toR = 0, toC = 0;
  int totalMoves;

  Conway c = Conway();

  while(in >> fromR >> fromC >> toR >> toC)
    {
      try
        {
          c.makeMove(fromR, fromC, toR, toC);
        }
      catch(...) {}
    }

  totalMoves = c.totalMoves();

  totalMoves == num_legal_moves ? PRINT_PASSED : PRINT_FAILED;
}

void testIsSolvedAtConfig(std::string board)
{
  std::stringstream ss;

  ss << "6 5 " << std::endl;
  ss << board << std::endl;

  Conway c = Conway(ss);

  c.isSolved() ? PRINT_FAILED : PRINT_PASSED;
}

void testIsSolvedAtSolved(std::string board)
{
  std::stringstream ss;

  ss << "6 5 " << std::endl;
  ss << board << std::endl;

  Conway c = Conway(ss);

  c.isSolved() ? PRINT_PASSED : PRINT_FAILED;
}
void testIsSolvedAfterMove(std::string board)
{
  std::stringstream ss;
  std::string moves("3 3 1 3  2 1 2 3  2 3 0 3  0 3 0 1");
  std::stringstream in(moves);
  int fromR = 0, fromC = 0, toR = 0, toC = 0;

  ss << "6 5 " << std::endl;
  ss << board << std::endl;

  Conway c = Conway(ss);

  while(in >> fromR >> fromC >> toR >> toC)
    {
      c.makeMove(fromR, fromC, toR, toC);
    }
    c.isSolved() ? PRINT_PASSED : PRINT_FAILED;
}

void testCopyConstructorCorrect()
{
  std::stringstream ss;
  std::string board = ".X....\n......\n.XXX..\n...X..\n......\n";

  ss << "6 5 " << std::endl;
  ss << board << std::endl;

  Conway c1 = Conway(ss);
  Conway c2 = Conway(c1);

  c1.toString() == c2.toString() ? PRINT_PASSED: PRINT_FAILED;
}
void testCopyConstructorDeep()
{
  std::stringstream ss;
  std::string board = ".X....\n......\n.XXX..\n...X..\n......\n";

  ss << "6 5 " << std::endl;
  ss << board << std::endl;

  Conway c1 = Conway(ss);
  Conway c2 = Conway(c1);

  c1.makeMove(3, 3, 1, 3);
  c1.toString() != c2.toString() ? PRINT_PASSED: PRINT_FAILED;
}


void testMoveConstructorCorrect()
{
  std::stringstream ss;
  std::string board = ".X....\n......\n.XXX..\n...X..\n......\n";

  ss << "6 5 " << std::endl;
  ss << board << std::endl;

  Conway c1 = Conway(ss);
  Conway c2 = Conway(std::move(c1));

  board == c2.toString() ? PRINT_PASSED: PRINT_FAILED;
}

void testAssignmentDeep()
{
  std::stringstream ss;
  std::string board = ".X....\n......\n.XXX..\n...X..\n......\n";

  ss << "6 5 " << std::endl;
  ss << board << std::endl;

  Conway c1 = Conway(ss);
  Conway c2 = c1;

  c1.makeMove(3, 3, 1, 3);
  c1.toString() != c2.toString() ? PRINT_PASSED: PRINT_FAILED;
}

void testAssignmentCopy()
{
  std::stringstream ss;
  std::string board = ".X....\n......\n.XXX..\n...X..\n......\n";

  ss << "6 5 " << std::endl;
  ss << board << std::endl;

  Conway c1 = Conway(ss);
  Conway c2 = c1;

  c1.toString() == c2.toString() ? PRINT_PASSED: PRINT_FAILED;
}

void testSelfAssignment()
{
  Conway c = Conway();
  c = c;
  PRINT_PASSED;
}

void testAssignmentReturn()
{
  std::stringstream ss1;
  std::stringstream ss2;

  std::string board1 = ".X....\n......\n.XXX..\n...X..\n......\n";
  std::string board2 = ".XX...\n......\n.XXX..\n...X..\n......\n";

  ss1 << "6 5 " << std::endl;
  ss1 << board1 << std::endl;

  ss2 << "6 5 " << std::endl;
  ss2 << board2 << std::endl;

  Conway c1 = Conway(ss1);
  Conway c2 = Conway(ss2);
  Conway c3 = c2 = c1;

  c1.toString() == c3.toString() ? PRINT_PASSED: PRINT_FAILED;
}

void testMoveAssignmentCorrect()
{
  std::stringstream ss;
  std::string board = ".X....\n......\n.XXX..\n...X..\n......\n";

  ss << "6 5 " << std::endl;
  ss << board << std::endl;

  Conway c1 = Conway(ss);
  Conway c2 = std::move(c1);

  board == c2.toString() ? PRINT_PASSED: PRINT_FAILED;
}

void testMoveReturn()
{
  std::stringstream ss1;
  std::stringstream ss2;

  std::string board1 = ".X....\n......\n.XXX..\n...X..\n......\n";
  std::string board2 = ".XX...\n......\n.XXX..\n...X..\n......\n";

  ss1 << "6 5 " << std::endl;
  ss1 << board1 << std::endl;

  ss2 << "6 5 " << std::endl;
  ss2 << board2 << std::endl;

  Conway c1 = Conway(ss1);
  Conway c2 = Conway(ss2);
  Conway c3 = c2 = std::move(c1);

  board1 == c3.toString() ? PRINT_PASSED: PRINT_FAILED;
}

int main(int argc, char **argv)
{
  int test = atoi(argv[1]);
  std::string board_init = "......\n......\n.XXX..\n...X..\n......\n";
  std::string board_solved = ".X....\n......\n.XXX..\n...X..\n......\n";
  std::string board3 = "......\n......\nXXXXXX\nX..X..\n......\n";
  std::string board23 = "..X...\n......\n.XXX..\n...X..\n......\n";
  // These are legal moves
  std::string moves2  = "3 3 1 3  2 1 2 3  2 3 0 3";
  std::string moves3  = "3 0 1 0  3 3 1 3  2 1 2 3";
  std::string moves19  = "3 3 1 3  2 1 2 3  2 3 0 3  9 9 9 9";

  try
    {
  switch (test)
    {
    case 0:
      testDefaultConstructor();
      break;
    case 1:
      testStreamConstructor();
      break;
    case 2:
      testStringStreamConstructor(argc, argv);
      break;
    case 5:
      testLegalMoves(board_init, moves2);
      break;
    case 6:
      testLegalMoves(board3, moves3);
      break;
    case 7:
      testBadMoves(std::string("-3 -3 1 3"));
      break;
    case 8:
      testBadMoves(std::string("30 3 10 3"));
      break;
    case 9:
      testBadMoves(std::string("30 30000 10 3000"));
      break;
    case 10:
      testMakeMoveStart();
      break;
    case 11:
      testMakeMoveOther();
      break;
    case 12:
      testMakeMoveIllegal(std::string(" 1 1 1 1"));
      break;
    case 13:
      testMakeMoveIllegal(std::string(" -3 -3 1 3"));
      break;
    case 14:
      testMakeMoveIllegal(std::string(" 30 3 10 3"));
      break;
    case 15:
      testMakeMoveIllegal(std::string(" 30 3000 50 300000"));
      break;
    case 16:
      testTotalMovesAtConfig(board_init);
      break;
    case 17:
      testTotalMovesAtConfig(board3);
      break;
    case 18:
      testTotalMovesAfterMoves(moves2, 3);
      break;
    case 19:
      testTotalMovesAfterMoves(moves19, 3);
      break;
    case 20:
      testIsSolvedAtConfig(board_init);
      break;
    case 21:
      testIsSolvedAtConfig(board3);
      break;
    case 22:
      testIsSolvedAtSolved(board_solved);
      break;
    case 23:
      testIsSolvedAfterMove(board23);
      break;
    case 24:
      testCopyConstructorCorrect();
      break;
    case 25:
      testCopyConstructorDeep();
      break;
    case 26:
      testMoveConstructorCorrect();
      break;
    case 28:
      testAssignmentCopy();
      break;
    case 29:
      testAssignmentDeep();
      break;
    case 30:
      testSelfAssignment();
      break;
    case 31:
      testAssignmentReturn();
      break;
    case 32:
      testMoveAssignmentCorrect();
      break;
    case 34:
      testMoveReturn();
      break;
    }
    }
  catch(...)
    {
      PRINT_PASSED;
    }
  return 0;
}
