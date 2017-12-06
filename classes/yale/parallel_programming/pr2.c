#include "dummy.h"
#include <stdio.h> 
#include <math.h>
#include <stdlib.h>
#include <time.h>
#include <sys/time.h>
#include <sys/types.h>
#include <sys/resource.h>


/* void timing_(double* wcTime, double* cpuTime) */
/* { */
/*    timing(wcTime, cpuTime); */
/* } */

void timing(double* wcTime, double* cpuTime)
{
   struct timeval tp;
   struct rusage ruse;

   gettimeofday(&tp, NULL);
   *wcTime=(double) (tp.tv_sec + tp.tv_usec/1000000.0); 
  
   getrusage(RUSAGE_SELF, &ruse);
   *cpuTime=(double)(ruse.ru_utime.tv_sec+ruse.ru_utime.tv_usec / 1000000.0);
}



double randomDouble()
{
  double drand_max = 100.0 / (double) RAND_MAX;
  double r = drand_max * (double) rand();
  return r;
}
void benchmark(double * a, double N){
  double* b = (double*)calloc(N,sizeof(double));
  double* c = (double*)calloc(N,sizeof(double));
  double* d = (double*)calloc(N,sizeof(double));
  for(int i=0;i<N;i++){
    b[i] = randomDouble();
    c[i]= randomDouble();
    d[i]=randomDouble();
  }

  for(int i=0;i<N;i++){
    a[i] = b[i]+c[i]*d[i];
  }
  free(b);
  free(c);
  free(d);
}

int main(){
  srand(time(NULL));//seeds rand num generator
  double k = 3.0;// exp used to calculate size of arrays
  //
  // stores timing values
  double runtime=0.0,wce=0.0,wcs=0.0,ct=0.0;
  
  // dont want to exceed k==24
  while(k <10.0){
    int repeat = 1;
    double N = floor(pow(2.1,k));// calculate N
    runtime = 0.0;

   // Initialize the arrays here so that the
   // initialization process is not counted in runtime
   // dummy conditional 
    double* a = (double*)calloc(N,sizeof(double));
    double* b = (double*)calloc(N,sizeof(double));
    double* c = (double*)calloc(N,sizeof(double));
    double* d = (double*)calloc(N,sizeof(double));

// Initialize them to random value
    for(int i=0;i<N;i++){
      b[i] = randomDouble();
      c[i]= randomDouble();
      d[i]=randomDouble();
        }
    for(; runtime<1; repeat*=2) {
      timing(&wcs, &ct);
      for(int r=0; r<repeat; ++r) {
        //benchmark(a,b,c,d,N);
          for(int i=0;i<N;i++){
            a[i] = b[i]+c[i]*d[i];
          }
        if (a[(int)N>>1]<0) dummy(); // fools the compiler
      }
      timing(&wce, &ct);
      runtime = wce - wcs;
    }
    //Here we calulate mFLOPS, caluclated by taking the number of
    // mega floating point operations (total FLos/1 miliion) divided 
    // by the runtime (~ 1 sec)
    printf("N: %f Mflops: %f\n",N,(2*N*repeat/pow(10.0,6.0))/runtime);
    repeat/=2;
    k++;
    free(a);
    free(b);
    free(c);
    free(d);}
    return 1;}
