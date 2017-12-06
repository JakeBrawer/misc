#include <string>
#include <iostream>
#include <sstream>

/**
 * Simple examples using strings and string streams.
 */

int main()
{
  // declare and initialize a string
  std::string s = "Hello world";

  // output a string
  std::cout << s << std::endl;

  // output first and last characters
  std::cout << s[0] << s[s.length() - 1] << std::endl;
  double one = 0.0;
  std::cin >> one;
  std::cout <<"one: " << one << std::endl;
  if(one != int(one))
    {
    std::cout << one << " is fp";
    }

  // read an entire line into a string
  std::cout << "Enter your name:" << std::endl;
  std::string name;
  std::getline(std::cin, name);
  std::cout << "Hello, " << name << std::endl;

  // create a stream that reads from a string
  std::istringstream sin(name);
  double first;
  sin >> first;
  std::cout << first << std::endl;
}

