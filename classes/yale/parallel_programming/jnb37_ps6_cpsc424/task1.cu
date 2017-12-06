#ifndef SERIAL
#define SERIAL 0
#endif
#ifndef FP
#define FP float
#endif

#include <stdio.h>
#include <cuda.h>
#include <stdlib.h>
#include <math.h>

__global__ void gpu_rect_matrixmult(FP *a,FP *b, FP *c,
                                    int n, int p, int m) {

  int col = threadIdx.x + blockDim.x * blockIdx.x;
  int row = threadIdx.y + blockDim.y * blockIdx.y;

  int indexb = col;
  
  if(col < m && row < n) {
    int index = row * m + col;

    c[index] = 0.;
    for (int indexa = row*p; indexa < (row*p + p); indexa++)
      for(){
      c[index] += a[indexa]*b[indexb];
    }
  }
}

void cpu_matrixmult(FP *a,FP *b, FP *c, int n) {

  int index, indexa, indexb;
  FP cvalue;
  for(int col=0;col < n; col++)
    for(int row=0;row < n; row++) {
      indexb = col;
      index = row * n + col;
      cvalue = 0.;
      for (indexa = row*n; indexa < (row*n + n); indexa++, indexb+=n) 
        cvalue += a[indexa]*b[indexb];
      c[index] -= cvalue; //NOTE: This calculates the diff between CPU and GPU computations.
    }
}

__global__ void gpu_sqr_matrixmult(FP *a,FP *b, FP *c, int n) {

  int col = threadIdx.x + blockDim.x * blockIdx.x;
  int row = threadIdx.y + blockDim.y * blockIdx.y;

  int indexb = col;
  int index = row * n + col;

  if(col < n && row < n) {
    c[index] = 0.;
    for (int indexa = row*n; indexa < (row*n + n); indexa++, indexb+=n) 
      c[index] += a[indexa]*b[indexb];
  }

}


// implements the kij matmult method
void cpu_kij_matrixmult(FP *a, FP *b, FP *c,
                    int n, int p, int m){
  FP r;
  FP cvalue;

  for(int k = 0; k < p; k++){
    for(int i = 0; i < n; i++){
      // hold element of A constant
      r = a[i*p + k];
      cvalue = 0.;
      // loop through rows of B and C
      for(int j = 0; j < m; j++){
        c[i*m + j] -= r * b[k*m + j];
        //cvalue += r * b[k*m + j];
        //c[i*m + j] -= cvalue;//NOTE: This calculates the diff between CPU and GPU computations.
      }
    }
  }
}

int main(int argc, char *argv[]) {

  int i, j; // loop counters

  int gpucount = 0; // Count of available GPUs
  int gpunum = 0; // Device number to use
  int Grid_X = 1; //Grid dimension, x and y, square
  int Grid_Y = 1; 
  int Block_Dim = 1; //Block dimension, x and y, square

  int m,n,p; // matrix dimension
  FP *a,*b,*c;
  FP *dev_a, *dev_b, *dev_c;
  int sizeA,sizeB,sizeC; // number of bytes in arrays

  cudaEvent_t start, stop; // using cuda events to measure time
  float elapsed_time_ms; // which is applicable for asynchronous code also
  cudaError_t errorcode;

  // --------------------SET PARAMETERS AND DATA -----------------------

  errorcode = cudaGetDeviceCount(&gpucount);
  if (errorcode == cudaErrorNoDevice) {
    printf("No GPUs are visible\n");
    exit(-1);
  }
  else {
     printf("Device count = %d\n",gpucount);
  }

  if ((argc<7) || (argc>8)) {
    printf("Usage: matmul  <n> <p> <m> <block dim> <grid dim> [<dev num>]\n");
    exit (-1);
  }

  n = atoi(argv[1]);
  p = atoi(argv[2]);
  m = atoi(argv[3]);

  Block_Dim = atoi(argv[4]); // Square block
  if (Block_Dim*Block_Dim > 1024) {
    printf("Error, too many threads in block\n");
    exit (-1);
  }

  Grid_X = atoi(argv[5]); // Square grid

  Grid_Y = atoi(argv[6]); // Square grid

  if (argc==5) {
    gpunum = atoi(argv[7]); // Device number
    if ((gpunum > 2) || (gpunum < 0)) {
      printf("Error, Device number must be 0, 1, or 2\n");
      exit (-1);
    }
  }
  Grid_X = m / Block_Dim;
  Grid_Y = n / Block_Dim;

  printf("Block_Dim = %d, Grid_X = %d Grid_Y = %d\n",Block_Dim,Grid_X,Grid_Y);
  printf("Matrix Dimensions:\n\t n: %d p: %d m: %d = %d\n",n,p,m,n*m);

  if (Grid_X*Block_Dim < m || Grid_Y * Block_Dim < n) {
    printf("Error, number of threads in x/y dimensions less than number of array elements\n");
    exit (-1);
  }
  cudaSetDevice(gpunum);
  printf("Using device %d\n",gpunum);
  

  dim3 Grid(Grid_X, Grid_Y); //Grid structure
  dim3 Block(Block_Dim, Block_Dim); //Block structure

  sizeA = n * p * sizeof(FP); // number of bytes in total in arrays
  sizeB = p * m * sizeof(FP);
  sizeC = n * m * sizeof(FP);

  a = (FP*) malloc(sizeA); // dynamically allocated memory for arrays on host
  b = (FP*) malloc(sizeB);
  c = (FP*) malloc(sizeC); // results from GPU

  srand(12345);
  for(i=0;i < n;i++)
    for(j=0;j < p;j++) {
      a[i * p + j] = (FP) rand() / (FP) RAND_MAX;
      //      a[i * p + j] = (FP) i+j; // may be helpful for debugging
    }

  for(i=0;i < p;i++)
    for(j=0;j < m;j++) {
      b[i * n + j] = (FP) rand() / (FP) RAND_MAX;
      //      b[i * n + j] = (FP) i+j; // may be helpful for debugging
    }

  // ------------- COMPUTATION DONE ON GPU ----------------------------

  cudaMalloc((void**)&dev_a, sizeA); // allocate memory on device
  cudaMalloc((void**)&dev_b, sizeB);
  cudaMalloc((void**)&dev_c, sizeC);

  cudaMemcpy(dev_a, a , sizeA ,cudaMemcpyHostToDevice);
  cudaMemcpy(dev_b, b , sizeB ,cudaMemcpyHostToDevice);

  cudaEventCreate(&start); // instrument code to measure start time
  cudaEventCreate(&stop);
  
  cudaEventRecord(start, 0);
  // cudaEventSynchronize(start); // not needed

  gpu_rect_matrixmult<<<Grid,Block>>>(dev_a,dev_b,dev_c,n,p,m);

  cudaEventRecord(stop, 0); // instrument code to measure end time
  cudaEventSynchronize(stop);
  cudaEventElapsedTime(&elapsed_time_ms, start, stop );

  cudaMemcpy(c,dev_c, sizeC ,cudaMemcpyDeviceToHost);

  printf("Time to calculate results on GPU: %f ms.\n", elapsed_time_ms); // exec. time

  if(SERIAL == 1){

  // ------------- COMPUTATION DONE ON HOST CPU ----------------------------
  // DEBUGGING USE ONLY (AND FOR LIMITED NUMBERS OF TIMING RUNS)

  cudaEventRecord(start, 0); // use same timing
  // cudaEventSynchronize(start); // not needed


  cpu_kij_matrixmult(a,b,c, n,p,m); // do calculation on host (NOTE: This computes the diff with GPU result.)

  cudaEventRecord(stop, 0); // instrument code to measue end time
  cudaEventSynchronize(stop);
  cudaEventElapsedTime(&elapsed_time_ms, start, stop );

  printf("Time to calculate results on CPU: %f ms.\n", elapsed_time_ms); // exec. time

// ------------------- check device creates correct results -----------------

  double error, suma, sumb, sumc, ai, bi, ci;
  suma = 0.; sumb = 0; sumc = 0;
  for(i=0;i < n*m;i++) {
    ai = (double) a[i];
    bi = (double) b[i];
    ci = (double) c[i];
    suma += ai*ai;
    sumb += bi*bi;
    sumc += ci*ci;
  }
  suma = sqrt(suma);
  sumb = sqrt(sumb);
  sumc = sqrt(sumc);
  error =  sumc/(sqrtf(n*m)*suma*sumb);
  printf("Scaled error between GPU and CPU: %e\n", error);

  }
// -------------- clean up ---------------------------------------

  free(a);
  free(b);
  free(c);
  cudaFree(dev_a);
  cudaFree(dev_b);
  cudaFree(dev_c);

  cudaEventDestroy(start);
  cudaEventDestroy(stop);

  return 0;

  }
