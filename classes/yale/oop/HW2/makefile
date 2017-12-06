CXX = g++
CXXFLAGS = -Wall -pedantic -std=c++11

SpinOut: spinout.o play.o
	${CXX} ${CXXFLAGS} -o $@ $^

Unit: spinout.cpp unit.cpp
	${CXX} ${CXXFLAGS} -o $@ $^
