#include <stdio.h>
#include<float.h>
#include <stdlib.h>
#include <math.h>
#include "mpi.h"


#ifdef DEBUG
#define DEBUG_PRINT(fmt, ...) fprintf(stderr, fmt, __VA_ARGS__)
#else
#define DEBUG_PRINT(fmt, ...) do {} while (0)
#endif

#define MUTATE_PROB .1
#define RAND_VAL rand() / (double) RAND_MAX
#define T_SIZE 4 // how many individuals in tournament selection?
#define MOD(x, N) ((x % N + N) % N)

typedef struct generation{
 
  int gen_size;
  int agent_size; // how many vals constitutes a single entity?
  double *agents;
  double *fitnesses;
}generation;

// Implements test func A 
double fitness(double *xs, int n,  double b){

  double i_to_k;
  double inner_sum;
  double outer_sum = 0.;

  for (double k  = 1; k  <= n; k++) {
    inner_sum = 0.;

    for (int i = 1; i <= n; i++) {
      i_to_k = pow((double) i , k) ;
      inner_sum +=
        (i_to_k + b) * ((pow(xs[i -1], k) / i_to_k) - 1.0);
      //DEBUG_PRINT("inner sum : %f\n", inner_sum);
   }
    outer_sum = inner_sum  * inner_sum;
 }
  return (1.0 - outer_sum);
}


void mutate(double *c, int n){
  // mutating by a val btw -1 and 1
  double mutation = 1. - 2. * RAND_VAL;

  for (int i = 0; i < n; i++) {
    if(RAND_VAL < MUTATE_PROB){

      c[i] += mutation;
      DEBUG_PRINT("Mutating %d by %f\n",i,mutation);
    }
  }
}



void recombine(double *p1, double *p2, double *c, int n){

  int co_point  =  (n - 1) - rand() % (n - 1);
  DEBUG_PRINT("co_point: %d\n", co_point);
  // copy parent genes to offspring
  for (int i = 0; i < n; i++) {
    // switch parents at co point.
    c[i] = (i < co_point) ? p1[i]: p2[i];
  }

  mutate(c, n);
}

// Initalizes a gen with values in [-n,n]
void initialize_generation(generation * p, const int gen_size,
                           const int n, const  double b){

  p->gen_size = gen_size;
  p->agent_size = n;
  p->agents = calloc(gen_size * n, sizeof *p->agents);
  p->fitnesses = calloc(gen_size, sizeof *p->fitnesses);

  for(int i = 0 ; i < gen_size; i++) {
    DEBUG_PRINT("agent %d: ",i);
    for(int j = 0; j < n; j++){
      p->agents[i*n + j] = n - (2.  * RAND_VAL * n);
      DEBUG_PRINT("%f ",p->agents[i*n +j]);
    }

    p->fitnesses[i] = fitness(&p->agents[i*n], n, b);
    DEBUG_PRINT("\nFitness: %f\n",p->fitnesses[i]);

  }
}

// New gens are created using crossover and mutation. Parents
// are selected using a tournament style process.
void create_new_gen(generation * parent_gen, generation *new_gen,
               const int n, const  double b, int gen_size){


  // Initialize the new gen
  new_gen->gen_size = gen_size;
  new_gen->agent_size = n;
  new_gen->agents = calloc(gen_size * n, sizeof *new_gen->agents);
  new_gen->fitnesses = calloc(gen_size, sizeof *new_gen->fitnesses);


  for (int i = 0; i < gen_size; i++) {
    int tourney[T_SIZE];
    int competitors[gen_size];// list of competitors to choose from
    double fst, snd;
    int fst_indx, snd_indx;

    for (int j = 0; j < gen_size; j++) competitors[j] = j;

    // We are selecting T_SIZE random competitors for
    // competition
    DEBUG_PRINT("\nThe %d competitors are:\n ",T_SIZE);
    for (int j = 0; j < T_SIZE; j++) {  
      int temp = competitors[j];
      int randomIndex = rand() % gen_size;

      competitors[j] = competitors[randomIndex];
      competitors[randomIndex] = temp;
      tourney[j] = competitors[randomIndex];

      //DEBUG_PRINT('%d ',tourney[j]);
    }

    fst = -DBL_MAX;
    snd = -DBL_MAX;

    // keep track of 1st and 2nd place winners
    // so that we can mate them.
    for (int j = 0; j < T_SIZE; j++) {
      if(fst <= parent_gen->fitnesses[tourney[j]] ){
        snd = fst;
        snd_indx = fst_indx;

        fst = parent_gen->fitnesses[tourney[j]];
        fst_indx = j;
      }
      else{
        if( snd < parent_gen->fitnesses[tourney[j]]){
          snd = parent_gen->fitnesses[tourney[j]];
          snd_indx = j;
        }
      }
      DEBUG_PRINT("\nFirst place: %f at indx: %d, 2nd place: %f at indx: %d\n",
                  fst,fst_indx,snd,snd_indx);
    }
    recombine(&parent_gen->agents[fst_indx * n], &parent_gen->agents[snd_indx * n],
              &new_gen->agents[i * n],n);

    new_gen->fitnesses[i] = fitness( &new_gen->agents[i * n], n, b);
  }

  free(parent_gen->agents);
  free(parent_gen->fitnesses);
}

double getMaxFitness(generation *p, int gen_size,int *index){
  double max = -DBL_MAX;

  for (int j = 0; j < gen_size; j++){
    if(max < p->fitnesses[j]) {
      max = p->fitnesses[j];
      *index = j;
    }
  }

  return max;
}

int main(int argc, char *argv[]){

  MPI_Init(&argc,&argv); // Required MPI initialization call


  if(argc < 5|| argc > 5){
    printf("Usage: stepping_stone <n> <b> <pop_size> <max gens>\n");
    exit(-1);
  }

  const int n = atoi(argv[1]);
  const  double b = atoi(argv[2]);
  const int pop_size = atoi(argv[3]);
  const int max_gens = atoi(argv[4]);
  int gen_counter = 0;
  int rank,size;
  int max_index;
  int local_stop = 0, global_stop = -1;
  double max_fitness = 0.;
  double wctim0, wctime1;
  double cputime;
  MPI_Status status;

  MPI_Comm_size(MPI_COMM_WORLD,&size); // Get no. of processes
  MPI_Comm_rank(MPI_COMM_WORLD, &rank); // Which process am I?

  int stopbuff[size];

  srand(12345 + rank);

  if(pop_size % size != 0 ){
    printf("ERROR, pop size must be divisible by num procs!\n");
    exit(-1);
  }

  // divide up total population for each
  // processes
  const int gen_size = pop_size / size;

  generation p;

  initialize_generation(&p,gen_size,n,b);

  timing(&wctim0, &cputime);

  while(gen_counter < max_gens && global_stop < 0){
    double sendbuff[n];
    double recvbuff[n];
    double recvfitnesses;
    generation o;

    // Which is the most fit agent in the subpop?
    max_fitness = getMaxFitness(&p,gen_size,&max_index);
    // copy fit agent's genes to sendbuffer
    for (int i  = 0; i < n; i++) {
      sendbuff[i] = p.agents[max_index * n + i];
    }


    // We want all procs to exit the loop once one processes finds
    // the global max
    if(max_fitness >= 1.0){local_stop = 1;}

    // update each node with your stopping information
    MPI_Allgather(&local_stop, 1, MPI_INT, stopbuff,1, MPI_INT, MPI_COMM_WORLD);

    // if one node is done, then all stop
    for (int i = 0; i < size; i++) {
      if(stopbuff[i] == 1){
        global_stop = i;
        printf("GLOBAL STOP %d\n", global_stop);
        break;
      }
    }


    // only send your best agent ever 10 gens
    if( gen_counter % 10 == 0){
    // send most fit agent to adjacent proc
      if(rank % 2 == 0){
        MPI_Send(sendbuff, n, MPI_DOUBLE, (rank + 1) % size,1,MPI_COMM_WORLD);
        MPI_Send(&max_fitness, 1, MPI_DOUBLE, (rank + 1) % size,1,MPI_COMM_WORLD);

        MPI_Recv(recvbuff, n, MPI_DOUBLE, MOD(rank - 1,size), 1, MPI_COMM_WORLD, &status);
        MPI_Recv(&recvfitnesses, 1, MPI_DOUBLE, MOD(rank - 1,size), 1, MPI_COMM_WORLD, &status);
      }
      else {
        MPI_Recv(recvbuff, n, MPI_DOUBLE, MOD(rank - 1,size), 1, MPI_COMM_WORLD, &status);
        MPI_Recv(&recvfitnesses, 1, MPI_DOUBLE, MOD(rank - 1,size), 1, MPI_COMM_WORLD, &status);

        MPI_Send(sendbuff, n, MPI_DOUBLE, (rank + 1) % size,1,MPI_COMM_WORLD);
        MPI_Send(&max_fitness, 1, MPI_DOUBLE, (rank + 1) % size,1,MPI_COMM_WORLD);
      }

      // loop through each procs agent list and replace any that are
      // less fit than the received agents

      for (int i = 0; i < gen_size; i++) {

        // We dont want two copies of the best individual
        if(p.fitnesses[i] < recvfitnesses ){

          for(int j = 0; j < n; j++){
            p.agents[i * n + j] = recvbuff[j];
          }
          p.fitnesses[i] = recvfitnesses;
        }
      }
    }

    DEBUG_PRINT("------------------------------");
    DEBUG_PRINT("Rank: %d Gen %d, Max agent: %f",rank,gen_counter,max_fitness);
    DEBUG_PRINT("------------------------------\n");

    create_new_gen(&p,&o,n,b,gen_size);

    p = o;

    gen_counter++;
  }


  timing(&wctime1, &cputime);
  if(global_stop == rank || (rank == 0 && global_stop == -1)){
    printf("n: %d b: %f pop Size: %d",n,b,pop_size);
    printf("\nRank %d finished in %d gens. TOTAL TIME: %f\n",
          rank, gen_counter, wctime1-wctim0);
    printf("Avg time per gen: %f\n", (wctime1 - wctim0) / gen_counter);
    printf("Max fitness : %f: ",max_fitness);
    for(int i = 0; i < n; i++)
      printf("%f ", p.agents[n * max_index + i]);
    printf("\n");
  }


  MPI_Finalize();
  return 0;
}

