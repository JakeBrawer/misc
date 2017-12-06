#include <cmath>
#include <iostream>
#include <fstream>
#include <cstring>
#include <cstdlib>
#include <string>
#include <vector>
#include <map>


using std::cout;
using std::endl;

struct point
{
  double x;
  double y;
};


double euclideanDistance(double x1, double y1, double x2, double y2)
{
  double distance = std::sqrt(std::pow(x1 - x2, 2) + std::pow(y1 - y2, 2));
  return distance;
}

int main(int argc, char **argv)
{

  if(argc < 3)
    {
      std::cout<<"Sorry, please pass the correct input" << endl;
      return 1;
    }
  else
    {
      int flag_i = 2;
      std::vector<std::string> locs;
      std::vector<std::string>::iterator locs_iter;

      // std::vector<airport> airports;
      // std::vector<airport>::iterator airports_iter;
      std::map<std::string, point> airports;

      double route_len = 0.0;

      if(strcmp(argv[flag_i], "-f") == 0)
        {
          std::cout<<"Sorry, please pass correct  flag" << endl;
          return 1;
        }
      else
        {
          std::ifstream f(argv[flag_i]);

          for(int i = flag_i + 1; i < argc; i++)
            {
              cout << argv[i] << endl;
              locs.push_back(argv[i]);
            }

          if(f.is_open())
            {
              std::string line;
              std::string loc;
              double x, y;
              double last_x = 0.0, last_y = 0.0;

              while(f >> loc >> x >> y)
                {
                  for(locs_iter = locs.begin();
                      locs_iter != locs.end();
                      locs_iter++)
                    {
                      if(!loc.compare(*locs_iter))
                        {
                          point a;

                          cout << "name: " << loc << endl;
                          a.x = x;
                          a.y = y;

                          airports.insert(std::make_pair(loc, a));

                        }
                    }
                }
              for (locs_iter = locs.begin();
                   locs_iter != locs.end();
                   locs_iter++)
                {
                  point a = airports.find(*locs_iter)->second;
                  //cout << airports_iter->x << airports_iter->y << endl;
                  if(locs_iter == locs.begin())
                    {
                      last_x = a.x;
                      last_y = a.y;
                    }

                  cout << "Locs: " <<*locs_iter << endl;
                  // cout <<"loc: " << airports.find(*locs_iter)->second.x << endl;

                  route_len += euclideanDistance(a.x,
                                                 a.y,
                                                 last_x,
                                                 last_y);
                  cout << route_len << endl;
                  last_x = a.x;
                  last_y = a.y;

                }
            }

          f.close();

          cout << "Total dist traveled: " << route_len << endl;
        }
    }

  return 1;
}
