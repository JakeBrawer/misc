#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <omp.h>

#ifndef TILE
#define TILE 4
#endif 

typedef struct BodySet { 
  float *x, *y, *z;
  float *vx, *vy, *vz; 
} BodySet;

void MoveBodies(const int nBodies,  BodySet* const bodies,
                const float dt) {

  // Avoid singularity and interaction with self
  const float softening = 1e-20;

  // Loop over bodies that experience force
  for (int i = 0; i < nBodies; i+=TILE) { 

    // Components of the gravity force on body i
    float Fx = 0, Fy = 0, Fz = 0; 

      
      // Loop over bodies that exert force: vectorization expected here
      #pragma omp parallel for reduction (+:Fx), reduction(+:Fy), reduction(+:Fz)
      for (int j = 0; j < nBodies; j++) { 
        // These vals dont change that much in inner loop
        // so saving them here might speed stuff up
        float const j_x = bodies->x[j];
        float const j_y = bodies->y[j];
        float const j_z =  bodies->z[j];

          #pragma unroll_and_jam(TILE)
          for(int x = i; x < i+TILE; x++){
            // Newton's law of universal gravity
            const float dx = j_x - bodies->x[x];
            const float dy = j_y - bodies->y[x];
            const float dz = j_z - bodies->z[x];

          const float drSquared  = dx*dx + dy*dy + dz*dz;
          // more efficient than pow.
          // Add Softening term so we dont div by 0.
          const float drPower32Recip  = 1.0f / sqrtf(drSquared * drSquared * drSquared + softening) ;
          // Calculate the net force
          Fx += dx * drPower32Recip;  
          Fy += dy * drPower32Recip;  
          Fz += dz * drPower32Recip;

      }
    }
    // Accelerate bodies in response to the gravitational force
    #pragma omp parallel for
    for(int x = i; x < i+TILE; x++){
      bodies->vx[x] += dt*Fx; 
      bodies->vy[x] += dt*Fy; 
      bodies->vz[x] += dt*Fz;
    }
  }

  // Move bodies according to their velocities
#pragma omp parallel for 
  for (int i = 0 ; i < nBodies; i++) { 
    bodies->x[i]  += bodies->vx[i]*dt;
    bodies->y[i]  += bodies->vy[i]*dt;
    bodies->z[i]  += bodies->vz[i]*dt;
  }
}

int main(const int argc, const char** argv) {

  // Problem size and other parameters
  const int num_threads = (argc > 1 ? atoi(argv[1]) : 4);
  const int nBodies = (argc == 3 ? atoi(argv[2]) : 16384);
  const int nSteps = 10;  // Duration of test
  const float dt = 0.01f; // Body propagation time step

  // set num threads to user input
  omp_set_num_threads(num_threads);
  // Body data stored as an Structure of Arrays (SoA)
  BodySet bodies;

  // initialize arrays in SoA
  bodies.x = calloc(nBodies,sizeof *bodies.x);
  bodies.y = calloc(nBodies,sizeof *bodies.y);
  bodies.z = calloc(nBodies,sizeof *bodies.z);

  bodies.vx = calloc(nBodies,sizeof *bodies.vx);
  bodies.vy = calloc(nBodies,sizeof *bodies.vy);
  bodies.vz = calloc(nBodies,sizeof *bodies.vz);


  // Initialize random number generator and bodies
  srand(0);
  float randmax;
  randmax = (float) RAND_MAX;
  for(int i = 0; i < nBodies; i++) {
    bodies.x[i] = ((float) rand())/randmax; 
    bodies.y[i] = ((float) rand())/randmax; 
    bodies.z[i] = ((float) rand())/randmax; 
    bodies.vx[i] = ((float) rand())/randmax; 
    bodies.vy[i] = ((float) rand())/randmax; 
    bodies.vz[i] = ((float) rand())/randmax; 
  }

  // Compute initial center of mass  
  float comx = 0.0f, comy=0.0f, comz=0.0f;
  for (int i=0; i<nBodies; i++) {
    comx += bodies.x[i];
    comy += bodies.y[i];
    comz += bodies.z[i];
  }
  comx = comx / nBodies;
  comy = comy / nBodies;
  comz = comz / nBodies;

  printf("Initial center of mass: (%g, %g, %g)\n", comx, comy, comz);

  // Perform benchmark
  printf("\n\033[1mNBODY Version 04\033[0m\n");
  printf("\nPropagating %d bodies using %d thread with tile size %d on %s...\n\n", 
         nBodies,omp_get_max_threads(),TILE, "CPU");

  double rate = 0, dRate = 0; // Benchmarking data
  const int skipSteps = 3; // Set this to a positive int to skip warm-up steps

  printf("\033[1m%5s %10s %10s %8s\033[0m\n", "Step", "Time, s", "Interact/s", "GFLOP/s"); fflush(stdout);

  for (int step = 1; step <= nSteps; step++) {

    const double tStart = omp_get_wtime(); // Start timing
    MoveBodies(nBodies, &bodies, dt);
    const double tEnd = omp_get_wtime(); // End timing

    // These are for calculating flop rate. It ignores symmetry and 
    // estimates 20 flops per body-body interaction in MoveBodies
    const float HztoInts   = (float)nBodies * (float)(nBodies-1) ;
    const float HztoGFLOPs = 20.0*1e-9*(float)nBodies*(float)(nBodies-1);

    if (step > skipSteps) { 
      // Collect statistics 
      rate  += HztoGFLOPs / (tEnd - tStart); 
      dRate += HztoGFLOPs * HztoGFLOPs / ((tEnd-tStart)*(tEnd-tStart)); 
    }

    printf("%5d %10.3e %10.3e %8.1f %s\n", 
	   step, (tEnd-tStart), HztoInts/(tEnd-tStart), HztoGFLOPs/(tEnd-tStart), (step<=skipSteps?"*":""));
    fflush(stdout);
  }

  rate/=(double)(nSteps-skipSteps); 
  dRate=sqrt(fabs(dRate/(double)(nSteps-skipSteps)-rate*rate));

  printf("-----------------------------------------------------\n");
  printf("\033[1m%s %4s \033[42m%10.1f +- %.1f GFLOP/s\033[0m\n",
	 "Average performance:", "", rate, dRate);
  printf("-----------------------------------------------------\n");
  printf("* - warm-up, not included in average\n\n");

  // Compute final center of mass
  comx = 0.0f; comy=0.0f; comz=0.0f;
  for (int i=0; i<nBodies; i++) {
    comx += bodies.x[i];
    comy += bodies.y[i];
    comz += bodies.z[i];
  }
  comx = comx / nBodies;
  comy = comy / nBodies;
  comz = comz / nBodies;
  
  printf("Final center of mass: (%g, %g, %g)\n", comx, comy, comz);

  free(bodies.x);
  free(bodies.vx);
  free(bodies.y);
  free(bodies.vy);
  free(bodies.z);
  free(bodies.vz);
}
