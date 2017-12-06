#include <stdio.h>
#include <string.h>
#include <stddef.h> 
#include <stdlib.h> 
#include <unistd.h> 
#include "mpi.h"
#include "timing.h"

main(int argc, char **argv ) {

  /*
    This is the Hello World program for CPSC424/524.

    Author: Andrew Sherman, Yale University

    Date: 1/23/2017

    Credits: This program is based on a program provided by Barry Wilkinson (UNCC), which 
             had a similar communication pattern, but did not include any simulated work.
  */

  char message[100];
  int i,rank, size, type=99; 
  int worktime, sparm, rwork(int,int);
  double wct0, wct1, total_time, cput;

  MPI_Status status;

  MPI_Init(&argc,&argv); // Required MPI initialization call

  MPI_Comm_size(MPI_COMM_WORLD,&size); // Get no. of processes
  MPI_Comm_rank(MPI_COMM_WORLD, &rank); // Which process am I?

  /* If I am the master (rank 0) ... */
  if (rank == 0) {

    sparm = rwork(0,0); //initialize the workers' work times
    
    /* Create the message using sprintf */

    MPI_Barrier(MPI_COMM_WORLD); //wait for everyone to be ready before starting timer
    timing(&wct0, &cput); //set the start time

    /* Send the message to all the workers, which is where the work happens */
    for (i=1; i<size; i++) {
      MPI_Send(&sparm, 1, MPI_INT, i, type, MPI_COMM_WORLD);
    } 

    // This block of recieve statements collates and prints the messages from the
    // different processes. Because MPI_Recv blocks until it recieves a message,
    // ordering MP_Recv calls by ascending rank will ensure the messages will
    // be recieved thusly.
    MPI_Recv(message, 100, MPI_CHAR, 1, type, MPI_COMM_WORLD, &status);
    sleep(3);
    printf("Message from prcoess %d: %s\n",status.MPI_SOURCE,message);

    MPI_Recv(message, 100, MPI_CHAR, 2, type, MPI_COMM_WORLD, &status);
    sleep(3);
    printf("Message from prcoess %d: %s\n",status.MPI_SOURCE,message);

    MPI_Recv(message, 100, MPI_CHAR, 3, type, MPI_COMM_WORLD, &status);
    sleep(3);
    printf("Message from prcoess %d: %s\n",status.MPI_SOURCE,message);

    // Times and outputs total time of all processes.
    timing(&wct1, &cput); //get the end time
    total_time = wct1 - wct0;
    printf("Message printed by master: Total elapsed time is %f seconds.\n",total_time);

  }

  /* Otherwise, if I am a worker ... */
  else {
 
    MPI_Barrier(MPI_COMM_WORLD); //wait for everyone to be ready before starting
  /* Receive messages from the master */
    MPI_Recv(&sparm, 1, MPI_INT, 0, type, MPI_COMM_WORLD, &status);

    worktime = rwork(rank,sparm); // Simulate some work

    // creates desired message and sends to master
    sprintf(message, "Hello master, from processes %d after working %d seconds\n",rank,worktime);
    MPI_Send(message, strlen(message)+1, MPI_CHAR, 0, type, MPI_COMM_WORLD);
  }

  MPI_Finalize(); // Required MPI termination call
}
