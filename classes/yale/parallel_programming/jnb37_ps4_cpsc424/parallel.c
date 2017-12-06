#include <stdio.h>;
#include <stdlib.h>
#include <math.h>
#include "mpi.h"

void totalForce(int N, double *masses,
                  double *x, double *y, double *z,
                double *f_x, double *f_y, double *f_z ){

  double dx,dy,dz;
  double m1,m2,m_product; // stores masses
  double r,r_3; // stores distance info
  double x_1, y_1, z_1; //position of body of interest
  double x_2, y_2, z_2; // position of other body


  // zero all forces
  for(int i = 0; i < N; i++){
    f_x[i] = 0.;
    f_y[i] = 0.;
    f_z[i] = 0.;
  }

  // whats body's mass and position?
  for(int i = 0; i < N; i++){
    
    m1 = masses[i];
    x_1 = x[i];
    y_1 = y[i];
    z_1 = z[i];

    // loop through all N bodies
    for(int j=i+1;j<N;j++){

      m2 = masses[j];
      x_2 = x[j];
      y_2 = y[j];
      z_2 = z[j];

      // calculate distance
      dx = x_2-x_1;
      dy = y_2-y_1;
      dz = z_2-z_1;

      r = sqrt(dx*dx + dy*dy +dz*dz);


      // only care about bodies within 5 units from body
      if(r <= 5.0){
        // A micro-optimization: only
        // need to calculate these vals once
        m_product = m1*m2;
        r_3 = 1.0/(r*r*r);

        // exploit Newton's third law to do fewer force computations
        f_x[i]+=m_product*(dx)*r_3;
        f_y[i]+=m_product*(dy)*r_3;
        f_z[i]+=m_product*(dz)*r_3;

        f_x[j]-=m_product*(dx)*r_3;
        f_y[j]-=m_product*(dy)*r_3;
        f_z[j]-=m_product*(dz)*r_3;

      }
    
    }
  }
}
  

void updateVelocity(double mass, double DT, double f_x,
                    double f_y, double f_z, double *vx,
                    double *vy, double *vz, double *mean_vs){

  double one_div_mass;
  // for optimization purposes
  double DT_div_2;
  double a[3]; // stores acceleration in a direction

  // micro optimization: do one division instead of 3.
  one_div_mass = 1.0/mass;
  DT_div_2 = DT/2.0;

  // calculate acceleration in a given direction
  a[0] = one_div_mass*f_x;
  a[1] = one_div_mass*f_y;
  a[2] = one_div_mass*f_z;

  mean_vs[0] = *vx + DT_div_2*a[0];
  mean_vs[1] = *vy + DT_div_2*a[1];
  mean_vs[2] = *vz + DT_div_2*a[2];
  
  // use that acceleration to calc new velocity
  *vx += DT*a[0];
  *vy += DT*a[1];
  *vz += DT*a[2];

}

void sumVelocity(int N, double *vxs, double *vys, double *vzs,
                 double* x_avg, double* y_avg, double* z_avg){

  *x_avg = 0.;
  *y_avg = 0.;
  *z_avg = 0.;

  for(int i = 0; i < N; i++){
    *x_avg+= vxs[i];
    *y_avg+= vys[i];
    *z_avg+= vzs[i];
  }



}

// calculates x,y,z coords of the center of mass of the
// entire system.
void centerOfMassSum(int N, double *xs, double *ys, double *zs,
                  double* x_center, double *y_center, double *z_center,
                     double* masses){
  int i;
  double m;
  double mx_sum =0., my_sum =0., mz_sum =0.; // store product sums

  // iterate through all N bodies
  for(i = 0; i < N; i++){

    m = masses[i]; // what is the mass of body i?


    // add products to running sum
    mx_sum += m*xs[i];
    my_sum += m*ys[i];
    mz_sum += m*zs[i];
  }

  // calc center of mass with above sums
  *x_center = mx_sum;
  *y_center = my_sum;
  *z_center = mz_sum;
}

// given x,y,z coords of a body, determines which
// octant the body belongs to
int whichOctant(double x, double y, double z){
  
  int octant = 0;
  octant += x >= 0 ? 0:4;
  octant += y >= 0 ? 0:2;
  octant += z >= 0 ? 0:1;

  return octant;
}

 main(int argc, char **argv ){

  /* num = (d1<<2) + (d2<<1) +  d3; */


  int i;// iterators
  int N,K;  // num of bodies and num steps respectively
  int step; // whats our curr time step?
  int rank, size;
  double DT; // time step size
  // master collates important data here and sends it out
  double global_data[3];
  double sum_vel_x, sum_vel_y, sum_vel_z;
  double center_x, center_y, center_z;
  double wctime_1, wctime_2, wctime_3,cputime;
  double *masses ; // array of N body masses
  // will store the x,y,z coords for each body
  double *pos_x,*pos_y,*pos_z;
  // will store the x,y,z velocity for each body
  double *vel_x,*vel_y,*vel_z;
  double *send_masses;
  double *send_pos_x, *send_pos_y, *send_pos_z;
  double *send_vel_x, *send_vel_y, *send_vel_z;
  double *recv_masses;
  double *recv_pos_x, *recv_pos_y, *recv_pos_z;
  double *recv_vel_x, *recv_vel_y, *recv_vel_z;
  double *extra_masses, *extra_pos_x, *extra_pos_y,*extra_pos_z;
  int *send_counts, *disps, *extra_disps;
  int *process_tracker;
  int *extra_bodies_count;
  int num_extra_bodies;
  int num_bodies; // how many bodies in my process
  FILE *fp; 

  double *f_x, *f_y, *f_z;
  double v_avg_vec[3];


  MPI_Init(&argc,&argv); // Required MPI initialization call

  MPI_Comm_size(MPI_COMM_WORLD,&size); // Get no. of processes
  MPI_Comm_rank(MPI_COMM_WORLD, &rank); // Which process am I?
  
  MPI_Status status;


  send_counts = (int *)calloc(size,sizeof(int));
  disps = (int *)calloc(size,sizeof(int));

  // Now that we know N we know how many elements
  // are in each of these arrays
  if(rank == 0){
    //open our data file
    fp = fopen(argv[1],"r");

    // Read in N,K, and DT
    fscanf(fp,"%d\n", &N);
    printf("N: %d\n",N);
    fscanf(fp,"%d\n", &K);
    printf("K: %d\n",K);
    fscanf(fp,"%lf\n",&DT);
    printf("DT: %lf\n",DT);

    // collect these variables in one place
    // so that they can be easily communicated
    // later
    global_data[0] = (double) N;
    global_data[1] = (double) K;
    global_data[2] = DT;


    masses = calloc(N, sizeof(double));
    
    send_masses =calloc(N, sizeof(double));

    pos_x = calloc(N,sizeof(double));
    pos_y = calloc(N,sizeof(double));
    pos_z = calloc(N,sizeof(double));

    send_pos_x = calloc(N,sizeof(double));
    send_pos_y = calloc(N,sizeof(double));
    send_pos_z = calloc(N,sizeof(double));

    vel_x = calloc(N,sizeof(double));
    vel_y = calloc(N,sizeof(double));
    vel_z = calloc(N,sizeof(double));

    send_vel_x = (double *)calloc(N,sizeof(double));
    send_vel_y = (double *)calloc(N,sizeof(double));
    send_vel_z = (double *)calloc(N,sizeof(double));



    // keeps track of which bodies are going to what process
    process_tracker = calloc(N,sizeof *process_tracker);
    

    // read in masses from file and populate array
    for(i=0; i < N; i++){
      fscanf(fp,"%lf\n",&masses[i]);
    }

    // read in positions from file and populate arrays
    for(i=0; i < N; i++){
      fscanf(fp,"%lf %lf %lf\n",&pos_x[i], &pos_y[i], &pos_z[i]);
    }

    // read in velocities from file and populate arrays
    for(i=0; i < N; i++){
      fscanf(fp,"%lf %lf %lf\n",&vel_x[i], &vel_y[i], &vel_z[i]);
    }


    fclose(fp);

    for(int i = 0,j = 0; i < N; i++ ){

      int octant = whichOctant(pos_x[i],pos_y[i],pos_z[i]);

      j = octant % size;
      process_tracker[i] = j;

      send_counts[j] +=1;
    }

    for(int i = 1, counter = 0;i < size;i++){

      counter += send_counts[i-1];
      disps[i] = counter;
    }

    // sorts bodies based on which processes they are going to.
    // this is a necessary step for scattering

    // each proc's data is seperated by a certain displacement
    // in the send buffers. These displacements change as we sort
    // the data. This buffer tracks these changes
    int *disps_indicies = calloc(size, sizeof *disps_indicies);
    for(int i = 0; i < N; i++ ){// loop through each body
      // which process is it going to?
      int p  = process_tracker[i];
      // whats the disp associated with this process?
      int disp = disps[p];
      int disps_index = disps_indicies[p];

      // place the body in the send buffers based on this displacement
      send_masses[disp+disps_index] = masses[i];
      send_pos_x[disp+disps_index] = pos_x[i];
      send_pos_y[disp+disps_index] = pos_y[i];
      send_pos_z[disp+disps_index] = pos_z[i];
      send_vel_x[disp+disps_index] = vel_x[i];
      send_vel_y[disp+disps_index] = vel_y[i];
      send_vel_z[disp+disps_index] = vel_z[i];

      disps_indicies[p]+=1;
      
    }

    free(process_tracker);
    free(disps_indicies);
    free(masses);
    free(pos_x);
    free(pos_y);
    free(pos_z);
    free(vel_x);
    free(vel_y);
    free(vel_z);
  }
  MPI_Bcast(send_counts,size,MPI_INT,0,MPI_COMM_WORLD);
  MPI_Bcast(disps,size,MPI_INT,0,MPI_COMM_WORLD);
  // send global ie (e.g N,K,DT) to other processes
  MPI_Bcast(global_data,3,MPI_DOUBLE,0,MPI_COMM_WORLD);
  
  N = (int) global_data[0];
  K = (int) global_data[1];
  DT = global_data[2];

  num_bodies = send_counts[rank];
  printf("Im proc: %d and I have %d bodies!\n",rank,send_counts[rank]);

  // Allocate recv buffers based on how many bodies each processes
  // is going to recieve
  recv_masses = calloc(num_bodies,sizeof *recv_masses);
  
  recv_pos_x = calloc(num_bodies,sizeof *recv_pos_x);
  recv_pos_y = calloc(num_bodies,sizeof *recv_pos_y);
  recv_pos_z = calloc(num_bodies,sizeof *recv_pos_z);


  recv_vel_x = calloc(num_bodies,sizeof *recv_vel_x);
  recv_vel_y = calloc(num_bodies,sizeof *recv_vel_y);
  recv_vel_z = calloc(num_bodies,sizeof *recv_vel_z);

  MPI_Scatterv(send_masses,send_counts,disps,MPI_DOUBLE,recv_masses,num_bodies,MPI_DOUBLE,0,MPI_COMM_WORLD);

  MPI_Scatterv(send_pos_x,send_counts,disps,MPI_DOUBLE,recv_pos_x,num_bodies,MPI_DOUBLE,0,MPI_COMM_WORLD);
  MPI_Scatterv(send_pos_y,send_counts,disps,MPI_DOUBLE,recv_pos_y,num_bodies,MPI_DOUBLE,0,MPI_COMM_WORLD);
  MPI_Scatterv(send_pos_z,send_counts,disps,MPI_DOUBLE,recv_pos_z,num_bodies,MPI_DOUBLE,0,MPI_COMM_WORLD);

  MPI_Scatterv(send_vel_x,send_counts,disps,MPI_DOUBLE,recv_vel_x,num_bodies,MPI_DOUBLE,0,MPI_COMM_WORLD);
  MPI_Scatterv(send_vel_y,send_counts,disps,MPI_DOUBLE,recv_vel_y,num_bodies,MPI_DOUBLE,0,MPI_COMM_WORLD);
  MPI_Scatterv(send_vel_z,send_counts,disps,MPI_DOUBLE,recv_vel_z,num_bodies,MPI_DOUBLE,0,MPI_COMM_WORLD);


  if(rank ==0){

    free(send_masses);
    free(send_pos_x);
    free(send_pos_y);
    free(send_pos_z);
    free(send_vel_x);
    free(send_vel_y);
    free(send_vel_z);
  }
  
  //printf("Im proc: %d and I have %d masses and I have %d bodies!!\n",rank,sizeof(send_masses)/sizeof(send_masses[0]),num_bodies);


  timing(&wctime_1,&cputime);

  for(step = 0; step < K+1; step++){

    if(step % 128 == 0 || step % K == 0){
      double x_vel_total = 0.;
      double y_vel_total = 0.;
      double z_vel_total = 0.;

      double x_pos_total = 0.;
      double y_pos_total = 0.;
      double z_pos_total = 0.;

      double local_mass_sum =0.;
      double mass_sum = 0.;
      timing(&wctime_2,&cputime);

      // each proc sums xyz components of there pos/vels
      sumVelocity(num_bodies,recv_vel_x,recv_vel_y,recv_vel_z,&sum_vel_x,&sum_vel_y,&sum_vel_z);
      // these sums are then summed at root and then divided by N.
      MPI_Reduce(&sum_vel_x,&x_vel_total,1,MPI_DOUBLE,MPI_SUM,0,MPI_COMM_WORLD);
      MPI_Reduce(&sum_vel_y,&y_vel_total,1,MPI_DOUBLE,MPI_SUM,0,MPI_COMM_WORLD);
      MPI_Reduce(&sum_vel_z,&z_vel_total,1,MPI_DOUBLE,MPI_SUM,0,MPI_COMM_WORLD);


      centerOfMassSum(num_bodies,recv_pos_x,recv_pos_y,recv_pos_z,&center_x,&center_y,&center_z,recv_masses);
      MPI_Reduce(&center_x,&x_pos_total,1,MPI_DOUBLE,MPI_SUM,0,MPI_COMM_WORLD);
      MPI_Reduce(&center_y,&y_pos_total,1,MPI_DOUBLE,MPI_SUM,0,MPI_COMM_WORLD);
      MPI_Reduce(&center_z,&z_pos_total,1,MPI_DOUBLE,MPI_SUM,0,MPI_COMM_WORLD);

      // calculate the sum of masses in each orthant
      for(i = 0; i < num_bodies; i++){local_mass_sum += recv_masses[i];}
      // need the sum of the mass sums to complete center of mass calculation
      MPI_Reduce(&local_mass_sum,&mass_sum,1,MPI_DOUBLE,MPI_SUM,0,MPI_COMM_WORLD);

      if(rank ==0){
      printf("--------- SIMULATION INFO (t: %lf)----------\n", wctime_2-wctime_1);
      printf("\t Beginning of time step: %d\n", step);
      printf("\t Current Center of Mass: [ %.7e, %.7e, %.7e]\n",x_pos_total/mass_sum,y_pos_total/mass_sum,z_pos_total/mass_sum); 
      printf("\t Current Average Velocity: [ %.7e, %.7e, %.7e]\n",x_vel_total/N,y_vel_total/N,z_vel_total/N); 
      }
      printf("Rank: %d  time: %lf\n",rank,wctime_2-wctime_1);

    }
        


    //send_masses = calloc(num_bodies*(size-1),sizeof *send_masses);
    free(send_counts);
    free(disps);

    send_counts = calloc(size, sizeof *send_counts);
    disps = calloc(size, sizeof *send_counts);


    // This loop determines how many bodies
    // are close enough to other octants to affect
    // the bodies therein.
    for(i = 0; i<num_bodies;i++){
      int oct;
      int p;

      double x = recv_pos_x[i];
      double y = recv_pos_y[i];
      double z = recv_pos_z[i];

      // if subtracting 5 units from a body's
      // coord puts it in a new octant than
      // it may affect the trajectory of
      // bodies in that octant
      double d_x = x + (x >= 0.?-5:5);
      double d_y = y + (y >= 0.?-5:5);
      double d_z = z + (z >= 0.?-5:5);

      int * to_other_procs = calloc(size - 1,sizeof *to_other_procs);
      free(to_other_procs);


      oct = whichOctant(d_x,y,z);
      p = oct % size;
      //printf("rank: %d bf: send: %d to proc: %d\n", rank,send_counts[p],p);
      send_counts[p] += (p != rank ? 1:0);
      // printf("rank: %d af: send: %d to proc: %d\n",rank, send_counts[p],p);

      oct = whichOctant(x,d_y,z);
      p = oct % size;
      send_counts[p] += (p != rank ? 1:0);

      oct = whichOctant(x,y,d_z);
      p = oct % size;
      send_counts[p] += (p != rank ? 1:0);

      if(x*x + y*y <= 25.) {
        oct = whichOctant(d_x,d_y,z);
        p = oct % size;
        send_counts[p] += (p != rank ? 1:0);
      }

      if(y*y + z*z <= 25.) {
        oct = whichOctant(x,d_y,d_z);
        p = oct % size;
        send_counts[p] += (p != rank ? 1:0);
      }

      if(x*x + z*z <= 25.) {
        oct = whichOctant(d_x,y,d_z);
        p = oct % size;
        send_counts[p] += (p != rank ? 1:0);
      }

      if(x*x + +y*y+ z*z <= 25.) {
        oct = whichOctant(d_x,d_y,d_z);
        p = oct % size;
        send_counts[p] += (p != rank ? 1:0);
      }
    }

    int send_counter = 0; // how many bodies are close to the octant boundaries?
    // calculate the total num of bodies to send
    for( i = 0; i < size;i++){send_counter+= send_counts[i];}

    for(int i = 1, counter = 0; i < size; i++){
      // calculate displacements using counts
      counter += send_counts[i-1];
      disps[i] = counter;
    }

    send_masses = calloc(send_counter, sizeof *send_masses);

    send_pos_x = calloc(send_counter, sizeof *send_pos_x);
    send_pos_y = calloc(send_counter, sizeof *send_pos_y);
    send_pos_z = calloc(send_counter, sizeof *send_pos_z);

    // Here is where we sort the sendbuffers by outgoing rank.
    // We essentially need to do the same calculations again to
    // do this

    int *disps_indicies = calloc(size,sizeof *disps_indicies);

    for(i = 0;i < num_bodies; i++){

      int oct;
      int p;
      int new_index;

      double x = recv_pos_x[i];
      double y = recv_pos_y[i];
      double z = recv_pos_z[i];

      double d_x = x + (x >= 0.?-5:5);
      double d_y = y + (y >= 0.?-5:5);
      double d_z = z + (z >= 0.?-5:5);

      // if subtracting 5 units from a body's
      // coord puts it in a new octant than
      // it may affect the trajectory of
      // bodies in that octant

      oct = whichOctant(d_x,y,z);
      p = oct % size;
      if(p != rank){
        new_index = disps[p]+disps_indicies[p];

        send_masses[new_index] = recv_masses[i];
        send_pos_x[new_index] = recv_pos_x[i];
        send_pos_y[new_index] = recv_pos_y[i];
        send_pos_z[new_index] = recv_pos_z[i];

        disps_indicies[p]+=1;
      }

      oct = whichOctant(x,d_y,z);
      p = oct % size;
      if(p != rank){
        new_index = disps[p]+disps_indicies[p];

        send_masses[new_index] = recv_masses[i];
        send_pos_x[new_index] = recv_pos_x[i];
        send_pos_y[new_index] = recv_pos_y[i];
        send_pos_z[new_index] = recv_pos_z[i];

        disps_indicies[p]+=1;
      }

      oct = whichOctant(x,y,d_z);
      p = oct % size;
      if(p != rank){
        new_index = disps[p]+disps_indicies[p];

        send_masses[new_index] = recv_masses[i];
        send_pos_x[new_index] = recv_pos_x[i];
        send_pos_y[new_index] = recv_pos_y[i];
        send_pos_z[new_index] = recv_pos_z[i];

        disps_indicies[p]+=1;
      }

      if(x*x + y*y <= 25.) {
        oct = whichOctant(d_x,d_y,z);
        p = oct % size;

        if(p != rank){
          new_index = disps[p]+disps_indicies[p];

          send_masses[new_index] = recv_masses[i];
          send_pos_x[new_index] = recv_pos_x[i];
          send_pos_y[new_index] = recv_pos_y[i];
          send_pos_z[new_index] = recv_pos_z[i];

          disps_indicies[p]+=1;
        }
      }

      if(y*y + z*z <= 25.) {
        oct = whichOctant(x,d_y,d_z);
        p = oct % size;

        if(p != rank){
          new_index = disps[p]+disps_indicies[p];

          send_masses[new_index] = recv_masses[i];
          send_pos_x[new_index] = recv_pos_x[i];
          send_pos_y[new_index] = recv_pos_y[i];
          send_pos_z[new_index] = recv_pos_z[i];

          disps_indicies[p]+=1;
        }
      }

      if(x*x + z*z <= 25.) {
        oct = whichOctant(d_x,y,d_z);
        p = oct % size;

        if(p != rank){
          new_index = disps[p]+disps_indicies[p];

          send_masses[new_index] = recv_masses[i];
          send_pos_x[new_index] = recv_pos_x[i];
          send_pos_y[new_index] = recv_pos_y[i];
          send_pos_z[new_index] = recv_pos_z[i];

          disps_indicies[p]+=1;
        }

      }

      if(x*x + +y*y+ z*z <= 25.) {
        oct = whichOctant(d_x,d_y,d_z);
        p = oct % size;

        if(p != rank){
          new_index = disps[p]+disps_indicies[p];

          send_masses[new_index] = recv_masses[i];
          send_pos_x[new_index] = recv_pos_x[i];
          send_pos_y[new_index] = recv_pos_y[i];
          send_pos_z[new_index] = recv_pos_z[i];

          disps_indicies[p]+=1;
        }

      }
    }


    // will store a count of bodies from other octants that
    // affect bodies in current octant.
    extra_bodies_count = calloc(size,sizeof extra_bodies_count);

    // this returns an array where each element corresponds to
    // how many bodies in the corresponding octant affect the bodies
    // in the current octant.
    MPI_Alltoall(send_counts,1,MPI_INT,extra_bodies_count,1,MPI_INT,MPI_COMM_WORLD);

    // use above array to calculate a single value
    num_extra_bodies = 0;
    for(i = 0; i < size; i++){
      num_extra_bodies+= extra_bodies_count[i];}

    // calculate recv buff displs for alltoallv
    extra_disps = calloc(size, sizeof *extra_disps);

    for(int i = 1, counter = 0; i < size; i++){
      // calculate displacements using counts
      counter += extra_bodies_count[i-1];
      extra_disps[i] = counter;
    }

    // Here we send bodies within range of oher octants, to those octants
    // so they can use them in their calculations
    extra_masses = calloc(num_extra_bodies,sizeof *extra_masses);

    extra_pos_x = calloc(num_extra_bodies, sizeof *extra_pos_x);
    extra_pos_y = calloc(num_extra_bodies, sizeof *extra_pos_y);
    extra_pos_z = calloc(num_extra_bodies, sizeof *extra_pos_z);

    MPI_Alltoallv(send_masses,send_counts,disps,MPI_DOUBLE,extra_masses,extra_bodies_count,extra_disps,MPI_DOUBLE,MPI_COMM_WORLD);
    MPI_Alltoallv(send_pos_x,send_counts,disps,MPI_DOUBLE,extra_pos_x,extra_bodies_count,extra_disps,MPI_DOUBLE,MPI_COMM_WORLD);
    MPI_Alltoallv(send_pos_y,send_counts,disps,MPI_DOUBLE,extra_pos_y,extra_bodies_count,extra_disps,MPI_DOUBLE,MPI_COMM_WORLD);
    MPI_Alltoallv(send_pos_z,send_counts,disps,MPI_DOUBLE,extra_pos_z,extra_bodies_count,extra_disps,MPI_DOUBLE,MPI_COMM_WORLD);

    recv_masses = realloc(recv_masses, (num_extra_bodies+num_bodies)*sizeof *recv_masses);
    recv_pos_x = realloc(recv_pos_x, (num_extra_bodies+num_bodies)*sizeof *recv_pos_x);
    recv_pos_y = realloc(recv_pos_y, (num_extra_bodies+num_bodies)*sizeof *recv_pos_y);
    recv_pos_z = realloc(recv_pos_z, (num_extra_bodies+num_bodies)*sizeof *recv_pos_z);

    // concatenate extra bodies with own bodies
    // for easy analysis
    for(i  = 0; i < num_extra_bodies;i++){
      int new_index = num_bodies+i;

      recv_masses[new_index] = extra_masses[i];
      recv_pos_x[new_index] = extra_pos_x[i];
      recv_pos_y[new_index] = extra_pos_y[i];
      recv_pos_z[new_index] = extra_pos_z[i];
      //printf("extra mass %d: %lf\n",i,extra_masses[i]);
    }

    free(extra_masses);
    free(extra_pos_x);
    free(extra_pos_y);
    free(extra_pos_z);

    free(send_masses);
    free(send_pos_x);
    free(send_pos_y);
    free(send_pos_z);
    free(disps_indicies);

    // While we store the forces on the extra bodies
    // the new positions arent calculated here, thats done
    // by the processes that own those bodies
    f_x = calloc(num_bodies+num_extra_bodies,sizeof *f_x);
    f_y = calloc(num_bodies+num_extra_bodies,sizeof *f_y);
    f_z = calloc(num_bodies+num_extra_bodies,sizeof *f_z);
    // calculate all forces on all bodies for this time step

    free(send_counts);
    send_counts = calloc(size,sizeof *send_counts);

    totalForce(num_bodies+num_extra_bodies,recv_masses,recv_pos_x,recv_pos_y,recv_pos_z,f_x,f_y,f_z);
    for(i = 0; i < num_bodies; i++){

      int p;
      // update recv_velocities based on these forces
      updateVelocity(recv_masses[i],DT,f_x[i],f_y[i],f_z[i],
                     &recv_vel_x[i],&recv_vel_y[i],&recv_vel_z[i],v_avg_vec);

      // update recv_position based on above recv_velocities
      recv_pos_x[i] += v_avg_vec[0]*DT;
      recv_pos_y[i] += v_avg_vec[1]*DT;
      recv_pos_z[i] += v_avg_vec[2]*DT;

      //did any of the bodies move to new octants?
      p = whichOctant(recv_pos_x[i],recv_pos_y[i],recv_pos_z[i]);
      // if so, keep track of it!
      send_counts[p]+=1; 
    }

    for(int i = 1, counter = 0; i < size; i++){
      // calculate displacements using counts
      counter += send_counts[i-1];
      disps[i] = counter;
    }

    disps_indicies = calloc(size,sizeof *disps_indicies);

    send_masses = calloc(num_bodies,sizeof *send_masses);
    send_pos_x = calloc(num_bodies,sizeof *send_pos_x);
    send_pos_y = calloc(num_bodies,sizeof *send_pos_y);
    send_pos_z = calloc(num_bodies,sizeof *send_pos_z);
    send_vel_x = calloc(num_bodies,sizeof *send_vel_x);
    send_vel_y = calloc(num_bodies,sizeof *send_vel_y);
    send_vel_z = calloc(num_bodies,sizeof *send_vel_z);

    // sort bodies by which octant they are currently in
    for(i = 0; i < num_bodies; i++){

      int p = whichOctant(recv_pos_x[i],recv_pos_y[i],recv_pos_z[i]);
      int new_index = disps[p]+disps_indicies[p];

      send_masses[new_index] = recv_masses[i];
      send_pos_x[new_index] = recv_pos_x[i];
      send_pos_y[new_index] = recv_pos_y[i];
      send_pos_z[new_index] = recv_pos_z[i];
      send_vel_x[new_index] = recv_vel_x[i];
      send_vel_y[new_index] = recv_vel_y[i];
      send_vel_z[new_index] = recv_vel_z[i];

      disps_indicies[p]+=1;
    }

    // How many bodies is each octant providing to this octant at this step?
    int *new_bodies_counts = calloc(size,sizeof *new_bodies_counts);

    MPI_Alltoall(send_counts,1,MPI_INT,new_bodies_counts,1,MPI_INT,MPI_COMM_WORLD);

    for(i = 0, num_bodies = 0;i < size; i++){num_bodies+= new_bodies_counts[i];}

    for(int i = 1, counter = 0;i < size;i++){

      counter += new_bodies_counts[i-1];
      extra_disps[i] = counter; 
    }

    free(recv_masses);
    free(recv_pos_x);
    free(recv_pos_y);
    free(recv_pos_z);
    free(recv_vel_x);
    free(recv_vel_y);
    free(recv_vel_z);

    recv_masses = calloc(num_bodies, sizeof *recv_masses);
    recv_pos_x = calloc(num_bodies, sizeof *recv_pos_x);
    recv_pos_y = calloc(num_bodies, sizeof *recv_pos_y);
    recv_pos_z = calloc(num_bodies, sizeof *recv_pos_z);
    recv_vel_x = calloc(num_bodies, sizeof *recv_vel_x);
    recv_vel_y = calloc(num_bodies, sizeof *recv_vel_y);
    recv_vel_z = calloc(num_bodies, sizeof *recv_vel_z);

    // Distribute new bodies to the correct octants
    MPI_Alltoallv(send_masses,send_counts,disps,MPI_DOUBLE,recv_masses,new_bodies_counts,extra_disps,MPI_DOUBLE,MPI_COMM_WORLD);
    MPI_Alltoallv(send_pos_x,send_counts,disps,MPI_DOUBLE,recv_pos_x,new_bodies_counts,extra_disps,MPI_DOUBLE,MPI_COMM_WORLD);
    MPI_Alltoallv(send_pos_y,send_counts,disps,MPI_DOUBLE,recv_pos_y,new_bodies_counts,extra_disps,MPI_DOUBLE,MPI_COMM_WORLD);
    MPI_Alltoallv(send_pos_z,send_counts,disps,MPI_DOUBLE,recv_pos_z,new_bodies_counts,extra_disps,MPI_DOUBLE,MPI_COMM_WORLD);
    MPI_Alltoallv(send_vel_x,send_counts,disps,MPI_DOUBLE,recv_vel_x,new_bodies_counts,extra_disps,MPI_DOUBLE,MPI_COMM_WORLD);
    MPI_Alltoallv(send_vel_y,send_counts,disps,MPI_DOUBLE,recv_vel_y,new_bodies_counts,extra_disps,MPI_DOUBLE,MPI_COMM_WORLD);
    MPI_Alltoallv(send_vel_z,send_counts,disps,MPI_DOUBLE,recv_vel_z,new_bodies_counts,extra_disps,MPI_DOUBLE,MPI_COMM_WORLD);

  free(extra_bodies_count);
  free(f_x);
  free(f_y);
  free(f_z);
  free(extra_disps);
 }

  MPI_Finalize();
 }
