CXX = g++
CXXFLAGS = -Wall -pedantic -std=c++11 -g3

Conway: conway.o conway_main.o
	${CXX} ${CXXFLAGS} -o $@ $^

Unit: conway.o unit.cpp
	${CXX} ${CXXFLAGS} -o $@ $^
