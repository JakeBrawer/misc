/**
 * Unit test skeleton for SpinOut.  This will compile
 * if the required members exist but does not test
 * the behavior of the members.
 */

#include <iostream>
#include "spinout.h"

using std::cout;
using std::endl;

// so -Wall doesn't complain about unused variables
void useInt(int x) {}
void useBool(bool x) {}
void useString(const std::string& s) {}

void testDefaultConstructor()
{
  cs427_527::SpinOut game1;
  if(game1.toString() == "///////")
    {
      cout << "PASSED" << endl;
    }
  else
    {
      cout << "FAILED" << endl;
    }
}


void testStringConstructor()
{
  cs427_527::SpinOut game2(std::string("/---/--"));
  if(game2.toString() == "/---/--")
    {
      cout << "PASSED" << endl;
    }
  else
    {
      cout << "FAILED" << endl;
        }

}

void testStringConstructorBad(const std::string &s)
{

  try{
    cs427_527::SpinOut game3(s);
    if( game3.toString() == s){
      cout << "FAILED" << endl;
      return;
    }
    else{
      cout << "PASSED" << endl;
    }
  }
  catch (...){
    cout << "PASSED" << endl;
  }

}

void testStringConstructorChar(const std::string &s)
{
  try{
    cs427_527::SpinOut game(s);
    if(game.toString()[3] == 'a'){
      cout << "FAILED" << endl;
      return;
    }
  }
  catch(...){
    cout << "PASSED" << endl;
    return;
  }

  cout << "PASSED" << endl;
}

void testLegalityStart(const std::string &s)
{
  cs427_527::SpinOut game(s);
  std::string suc;

  for(int i = 0; i < 7; i++)
    {
      if(game.isLegalMove(i) && (i != 6 || i != 5)){
        suc = "FAILED";
      }
      else{
        suc =  "PASSED";
      }
    }
  cout << suc << endl;
}

void testLegalityRandom(const std::string &s)
{
  // Only 4 and 6 should be legal here
  cs427_527::SpinOut game(s);
  if(!game.isLegalMove(4) || !game.isLegalMove(6)){
    cout << "FAILED" << endl;
    return;
  }
  for(int i; i < 7; i++)
    {
      if(game.isLegalMove(i) && (i != 4 || i != 6)){
        cout <<"FAILED";
        return;
      }
    }
  cout << "PASSED" << endl;
}

void testLegalityOOB(int i){
  cs427_527::SpinOut game;
  std::string s;

  s = (game.isLegalMove(i) ? "FAILED":"PASSED");
  cout << s << endl;
}

void testMakeMoveStart(){
  cs427_527::SpinOut game;
  game.makeMove(6);
  if(game.toString() == "//////-"){
    cout << "PASSED" << endl;
  }
  else{
    cout << "FAILED" << endl;
  }
}


void testMakeMoveRandomPosition(const std::string& s){
  // 4 and 6 are the only legal moves here
  cs427_527::SpinOut game1(s);
  cs427_527::SpinOut game2(s);

  game1.makeMove(4);
  game2.makeMove(6);

  if(game1.toString() != "---///-"){
    cout << "FAILED" << endl;
    return;
  }

  if(game2.toString() != "---/-//"){
    cout << "FAILED" << endl;
    return;
  }

  cout << "PASSED" << endl;
}

void testBadMove(int i){
  cs427_527::SpinOut game;

  try
    {
    game.makeMove(i);
    }
  catch(...)
    {
      cout << "PASSED" << endl;
      return;
    }

  cout << "PASSED" << endl;
}

void testTotalMovesRandom(const std::string& s)
{
  cs427_527::SpinOut game(s);
  game.totalMoves() == 0? cout << "PASSED": cout << "FAILED";
  cout << endl;
}


void testLegalSequence(){
  cs427_527::SpinOut game;
  for (int i = 0; i < 50; i++) {
    game.makeMove(6);
  }
  game.totalMoves() == 50? cout << "PASSED": cout << "FAILED";
  cout << endl;
}

void testIllegalSequence(){
  cs427_527::SpinOut game;
  for (int i = 0; i < 50; i++) {
    game.makeMove(6);
    try
      {
        game.makeMove(8);
      }
    catch(...){
      cout << "PASSED" << endl;
      return; 
    }
  }
  game.totalMoves() == 50? cout << "PASSED": cout << "FAILED";
  cout << endl;
}

void testIsSolved(const std::string& s )
{
  cs427_527::SpinOut game(s);
  if(game.toString() != "-------"){
    game.isSolved() ? cout << "FAILED": cout << "PASSED";
  }
  else
    {
      game.isSolved() ? cout << "PASSED": cout << "FAILED";
    }
  cout <<endl;
}

void testIsSolvedPastSolution()
{
  cs427_527::SpinOut game("-------");

  game.makeMove(6);

  game.isSolved() ? cout << "FAILED": cout << "PASSED";
  cout << endl;
}


int main(int argc, char **argv)
{
  int test = atoi(argv[1]);

  switch (test)
    {
    case 0:
      testDefaultConstructor();
      break;

    case 1:
      testStringConstructor();
      break;

    case 2:
      testStringConstructorBad(std::string("///"));
      break;

    case 3:
      testStringConstructorBad(std::string("///////////"));
      break;

    case 4:
      testStringConstructorChar(std::string("///a///"));
      break;

    case 5:
      testLegalityStart(std::string("///////"));
      break;

    case 6:
      testLegalityRandom(std::string("---/-/-"));
      break;

    case 7:
      testLegalityOOB(-1);
      break;

    case 8:
      testLegalityOOB(7);
      break;

    case 9:
      testLegalityOOB(100000);
      break;

    case 10:
      testMakeMoveStart();
      break;

    case 11:
      testMakeMoveRandomPosition(std::string("---/-/-"));
      break;

    case 12:
      testBadMove(2);
      break;

    case 13:
      testBadMove(-1);
      break;

    case 14:
      testBadMove(7);
      break;

    case 15:
      testBadMove(1000000);
      break;

    case 16:
      testTotalMovesRandom(std::string("-------"));
      break;

    case 17:
      testTotalMovesRandom(std::string("---/-/-"));
      break;

    case 18:
      testLegalSequence();
      break;

    case 19:
      testIllegalSequence();
      break;

    case 20:
      testIsSolved(std::string("///////"));
      break;

    case 21:
      testIsSolved(std::string("-/--/--"));
      break;

    case 22:
      testIsSolved(std::string("-------"));
      break;

    case 23:
      testIsSolvedPastSolution();
      break;

    }




  return 0;
}


