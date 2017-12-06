#include <stdio.h> 
#include <math.h>

double f(double x){
  return 1.0/(1.0+(x*x));}

double integrate(int iters){
  double x = 1.0/(2.0*(double)iters);
  double delt_x = 1.0/((double)iters);
  double sum = f(x)*delt_x;
  printf("init sum: %f\n x: %f\n x_delt: %f \n", sum,x, delt_x);
  while(x<1.0){
    x+= delt_x;
    // printf("x: %f\n", x);
    sum+= f(x)*delt_x;
    }
  return sum*4.0;


}
int main(){
  double pi = integrate(10000);
  printf("Pi approx: %f\n Sin(Pi): %f",pi , sin(pi));
}

 
