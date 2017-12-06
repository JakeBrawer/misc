#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include "mpi.h"


//useful functons for debugging
#define INT_ARRAY_SIZE(array ) (sizeof(array)/sizeof(int))
#define DOUBLE_ARRAY_SIZE(array) (sizeof(array)/sizeof(array[0]))
// % in c is a remainder and thus returns negative values.
// This is undesirable when calculating the rank of an incoming
// message.
#define MOD(x, N) ((x % N + N) % N)
#define MIN(a,b) (((a)<(b))?(a):(b))

int matmul(int, double*, double*, double*);

// Tests if the parallel method correctly implements
// matrix multiplication. 
int testParallelMethod(double *A, double *B,double *parallelC, int N){

  int i;
  int return_val=1;
  double * serialC;

  // Where we store resultant matrix for the serial
  // method.
  serialC = (double * ) calloc(N*N,sizeof(double));
  matmul(N,A,B,serialC);

  for(i = 0;i<N*N;i++){


    if(parallelC[i]!=serialC[i]){
      return_val = 0;
      printf("ERROR: NOT EQUAL at index: %d.serialC: %f  parallelC: %f\n",i,serialC[i],parallelC[i]);
    }
  }
  printf("CORRECT :^)\n");
  free(serialC);
  return return_val; 
}

main(int argc, char **argv ) {

  int rank, size, N, i, j, k,col_rank;
  int Ablock_size,Bblock_size; // How many elements in a block?
  int *block_size_array; // each proc now has a diff block size 
  int iA, iB,iC,pass_counter;
  int sizeAB, sizeC;
  int AoffSet,BoffSet;
  unsigned int  Acounter,blockCounter;
  // The matrices
  double *A, *B, *C;
  // Will recv scattered blocks from matrices A and B
  double *Arecv, *Brecv, *tmp_Brecv;
  // For timing comms and comps
  double wctime_total0,wctime_total1,wctime_comp0,wctime_comp1,
    wctime_comm0,wctime_comm1,cputime;
  double wctotal0, wctotal1;
  double comm_time_counter,comp_time_counter;


  // will store timings across all procs
  double *comm_time_array,*comp_time_array;

  MPI_Init(&argc,&argv); // Required MPI initialization call
  MPI_Comm_size(MPI_COMM_WORLD,&size); // Get no. of processes
  MPI_Comm_rank(MPI_COMM_WORLD, &rank); // Which process am I?
  
  MPI_Status status;
  MPI_Request req;

  col_rank = rank;
  // sets number of blocks based on num procs

  // Each process will calculate an entire block row
  // and store it here.
  double * resultBuff;

  // How many elements in each block to be scattered?
  int AsendCount[size], BsendCount[size];
  int Adisp[size], Bdisp[size],Cdisp[size]; // Stores the displacements 


  Acounter = 0;
  blockCounter=0;

  // get the matrix dimension from command line 
  if(argc>1){
    N = atoi(argv[1]);
  }
  // else default to N =1000
  else{
    N = 1000;
  }

  block_size_array = (int *)calloc(size,sizeof(int));

    // This loops calulates how many nonzero entries
    // will be in each row and column block.
  for(int i =0,b1=0,b2=0;i<size;i++){

    // block sizes increase quadratically in the previous
    // task so scaling by a root will balance how elements
    // each proc has to multiply. 
    b1= (int) N*sqrt((double)i/size);
    b2= (int) N*sqrt((double)(i+1)/size);
    
    // b1 and b2 are triangular numbers so determining
    // so we can exploit this to determine block size
    AsendCount[i] = b2*(b2+1)/2 - b1*(b1+1)/2;
    BsendCount[i] = b2*(b2+1)/2 - b1*(b1+1)/2;
    block_size_array[i] = b2-b1;
    if(rank==0){
      printf("size: %d\n",size);
    printf("\t%d\n",AsendCount[i]);}
  }

  // Allocates space of buffers for receiving blocks form
  // matrix A and B. Size is determined
  Arecv = (double *)calloc(AsendCount[rank],sizeof(double));
  Brecv = (double *)calloc(BsendCount[rank],sizeof(double));
  
  // Each process will calculate block_size number of rows
  resultBuff = (double *)calloc(N*block_size_array[rank],sizeof(double));


  Acounter = 0;

  // calculates the displacement for scatterv
  // this is based of the blocksize
  for( i = 0;i<size;i++){

    Adisp[i] = Acounter;
    Bdisp[i] = Acounter;

    Acounter+= AsendCount[i];

  }


  // Let the master do some initialization
  if (rank == 0){


    sizeAB = N*(N+1)/2; //Only enough space for the nonzero portions of the matrices
    sizeC = N*N; // All of C will be nonzero, in general!

    A = (double *) calloc(sizeAB, sizeof(double));
    B = (double *) calloc(sizeAB, sizeof(double));
    C = (double *) calloc(sizeC, sizeof(double));


    // Each processes will return timing info
    comm_time_array = (double *) calloc(size,sizeof(double));
    comp_time_array = (double *) calloc(size,sizeof(double));


    srand(12345); // Use a standard seed value for reproducibility

    // This assumes A is stored by rows, and B is stored by columns. Other storage schemes are permitted
    for (int i=0; i<sizeAB; i++) {A[i] = ((double) rand()/(double)RAND_MAX);}
    for (int i=0; i<sizeAB; i++) B[i] = ((double) rand()/(double)RAND_MAX);
  }

  timing(&wctotal0,&cputime);
  // sends out block rows and columns to each process
  MPI_Scatterv(A,AsendCount,Adisp,MPI_DOUBLE,Arecv,AsendCount[rank],MPI_DOUBLE,0,MPI_COMM_WORLD);
  MPI_Scatterv(B,BsendCount,Bdisp,MPI_DOUBLE,Brecv,BsendCount[rank],MPI_DOUBLE,0,MPI_COMM_WORLD);
  printf("DONE SCATTERING!\n\n");

  Ablock_size = block_size_array[rank];
    // what index relative to A does p's row block
    // start at?
  AoffSet = (int) N*sqrt((double)rank/size);
  
  //index into result buffer
  iC = 0;
  // Keeps track of how many times
  // a proc has gone round the round-robin
  pass_counter = 0;

  comm_time_counter = 0.;
  comp_time_counter = 0.;
  
  // This loop handle the matrix multiplication.
  while(pass_counter < size){ 

    timing(&wctime_comp0,&cputime);

    Bblock_size = block_size_array[col_rank];
    // what index relative to B does p's col block
    // start at?
    BoffSet = (int) N*sqrt((double)col_rank/size);

    for (i=0; i<Ablock_size; i++) {

      iC = i*N + BoffSet;
      iA = i*AoffSet +i*(i+1)/2; // initializes row pointer in A
      
      for (j=0; j<Bblock_size; j++,iC++) {

        iB =j*BoffSet+j*(j+1)/2; // initializes row pointer in A
        resultBuff[iC] =0.0;

        for (k=0; k<=MIN(i+AoffSet,j+BoffSet);k++) {

          resultBuff[iC] += Arecv[iA+k] * Brecv[iB+k];
        } // avoids using known-0 entries
      }
    }

    timing(&wctime_comp1,&cputime);
    comp_time_counter+= (wctime_comp1-wctime_comp0);

    timing(&wctime_comm0,&cputime);

    // Handles the communication between procs.
    // we want the even procs to pass before the
    // odds to avoid locks

    // Only need to pass to p-1 times
    if(pass_counter < size-1){


      // If we already passed some data that needs freeing
        if(pass_counter > 0){

          // Wait until the previous send has completed
          // before freeing the data
          MPI_Wait(&req,&status);
          free(tmp_Brecv);
        }

        // Create a temp buffer so that we can do nonblocking comms
        tmp_Brecv = Brecv;


        // Send the temp buff in a nonblocking fashion so we can do other computations.
        MPI_Isend(tmp_Brecv,BsendCount[col_rank],MPI_DOUBLE,(rank+1)%size,1,MPI_COMM_WORLD,&req);

        col_rank  = MOD(col_rank-1,size);
        
        Brecv = (double *)calloc(BsendCount[col_rank],sizeof(double));
        // wait for col from prev process
        MPI_Recv(Brecv,BsendCount[col_rank],MPI_DOUBLE,MOD(rank - 1,size),1,MPI_COMM_WORLD,&status);
        

      timing(&wctime_comm1,&cputime);
      comm_time_counter+= (wctime_comm1-wctime_comm0);


      pass_counter++;
    }
    else{break;}
  }


  // Collates the block rows calculated by the workers in the correct order. No further organization
  // is needed.


  // The number of elements is in each result buffer
  // is simply the number of rows in the block * N
  for(i=0;i<size;i++){AsendCount[i] = block_size_array[i]*N;}


  // Need to calculate a new disp
  // array based on above new send counts
  for(i=0,Acounter=0;i<size;i++){

    Cdisp[i] = Acounter;

    Acounter+= AsendCount[i];
  }


  MPI_Gatherv(resultBuff,Ablock_size*N,MPI_DOUBLE,C,AsendCount,Cdisp,MPI_DOUBLE,0,MPI_COMM_WORLD);

  // Gather timing related info.
  MPI_Gather(&comm_time_counter,1,MPI_DOUBLE,comm_time_array,1,MPI_DOUBLE,0,MPI_COMM_WORLD);
  MPI_Gather(&comp_time_counter,1,MPI_DOUBLE,comp_time_array,1,MPI_DOUBLE,0,MPI_COMM_WORLD);
    
  timing(&wctotal1,&cputime);


  

  if(rank==0){
    //testParallelMethod(A,B,C,N);
    printf("");

    
    printf("TIMINGS:\n ");
    printf("\t\t Comp time  Comm Time:\n");
    for(i=0,comm_time_counter=0.,comp_time_counter=0.;i<size;i++){
      printf("Rank %d\t %.7f  %.7f\n", i ,comp_time_array[i],comm_time_array[i]);

      comp_time_counter+=comp_time_array[i];
      comm_time_counter+=comm_time_array[i];
    }
    printf("\t total comp %.4f\n \t total comm: %.4f\n",comp_time_counter,comm_time_counter);
    printf("\t total time: %.4f\n",wctotal1-wctotal0);

    free(Arecv);
    free(Brecv);
    free(resultBuff);

    free(block_size_array);

    free(A);
    free(B);
    free(C);

    free(comm_time_array);
    free(comp_time_array);
  }

    
  MPI_Finalize();
}

