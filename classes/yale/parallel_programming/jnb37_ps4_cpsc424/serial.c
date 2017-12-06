#include <stdio.h>
#include <stdlib.h>
#include <math.h>

// calculates x,y,z forces acting on body by all
// other bodies in the vicinity and stores them
// in f_vec
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

void avgVelocity(int N, double *vxs, double *vys, double *vzs,
                 double* x_avg, double* y_avg, double* z_avg){
  double N_denom;

  *x_avg = 0.;
  *y_avg = 0.;
  *z_avg = 0.;

  for(int i = 0; i < N; i++){
    *x_avg+= vxs[i];
    *y_avg+= vys[i];
    *z_avg+= vzs[i];
  }

  N_denom = 1.0/((float)N);

  *x_avg *= N_denom;
  *y_avg *= N_denom;
  *z_avg *= N_denom;


}

// calculates x,y,z coords of the center of mass of the
// entire system.
void centerOfMass(double *xs, double *ys, double *zs,
                  double* x_center, double *y_center, double *z_center,
                  int N, double* masses){
  int i;
  double m;
  double m_sum = 0.; // stores sum of all masses
  double mx_sum =0., my_sum =0., mz_sum =0.; // store product sums

  // iterate through all N bodies
  for(i = 0; i < N; i++){

    m = masses[i]; // what is the mass of body i?

    // add mass to running sum
    m_sum+= m;

    // ad products to running sum
    mx_sum += m*xs[i];
    my_sum += m*ys[i];
    mz_sum += m*zs[i];
  }

  // calc center of mass with above sums
  *x_center = mx_sum/m_sum;
  *y_center = my_sum/m_sum;
  *z_center = mz_sum/m_sum;
}

int main(){

  int i;// iterators
  int N,K;  // num of bodies and num steps respectively
  int step; // whats our curr time step?
  double DT; // time step size
  double avg_vel_x, avg_vel_y, avg_vel_z;
  double center_x, center_y, center_z;
  double wctime_1, wctime_2,cputime;
  double *masses ; // array of N body masses
  // will store the x,y,z coords for each body
  double *pos_x,*pos_y,*pos_z;
  // will store the x,y,z velocity for each body
  double *vel_x,*vel_y,*vel_z;
  FILE *fp; 

  double *f_x, *f_y, *f_z;
  double v_avg_vec[3];
  //open our data file
  fp = fopen("./data/testdata1","r");

  // Read in N,K, and DT
  fscanf(fp,"%d\n", &N);
  printf("N: %d\n",N);
  fscanf(fp,"%d\n", &K);
  printf("K: %d\n",K);
  fscanf(fp,"%lf\n", &DT);
  printf("DT: %lf\n",DT);
  //DT = 1000.0;

  // Now that we know N we know how many elements
  // are in each of these arrays
  masses = (double *) calloc(N, sizeof(double));

  pos_x = (double *)calloc(N,sizeof(double));
  pos_y = (double *)calloc(N,sizeof(double));
  pos_z = (double *)calloc(N,sizeof(double));

  vel_x = (double *)calloc(N,sizeof(double));
  vel_y = (double *)calloc(N,sizeof(double));
  vel_z = (double *)calloc(N,sizeof(double));

  f_x = (double *)calloc(N,sizeof(double));
  f_y = (double *)calloc(N,sizeof(double));
  f_z = (double *)calloc(N,sizeof(double));

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

  timing(&wctime_1,&cputime);
  for(step = 0; step < K; step++){

    if(step % 128 == 0){
      timing(&wctime_2,&cputime);
      printf("--------- SIMULATION INFO (t: %lf)----------\n", wctime_2-wctime_1);
      printf("\t Beginning of time step: %d\n", step);
      centerOfMass(pos_x,pos_y,pos_z,&center_x,&center_y,&center_z,N,masses);
      printf("\t Current Center of Mass: [ %.7e, %.7e, %.7e]\n",center_x,center_y,center_z); 
      avgVelocity(N,vel_x,vel_y,vel_z,&avg_vel_x,&avg_vel_y,&avg_vel_z);
      printf("\t Current Average Velocity: [ %.7e, %.7e, %.7e]\n",avg_vel_x,avg_vel_y,avg_vel_z); 

    }
        

    // calculate all forces on all bodies for this time step
    totalForce(N,masses,pos_x,pos_y,pos_z,f_x,f_y,f_z);

    for(i = 0; i < N; i++){

      // update velocities based on these forces
      updateVelocity(masses[i],DT,f_x[i],f_y[i],f_z[i],
                     &vel_x[i],&vel_y[i],&vel_z[i],v_avg_vec);

      // update position based on above velocities
      pos_x[i] += v_avg_vec[0]*DT;
      pos_y[i] += v_avg_vec[1]*DT;
      pos_z[i] += v_avg_vec[2]*DT;


    }
  }
  timing(&wctime_2,&cputime);
  printf("--------- SIMULATION INFO (t: %lf)----------\n", wctime_2-wctime_1);
  printf("\t Beginning of time step: %d\n", step);
  centerOfMass(pos_x,pos_y,pos_z,&center_x,&center_y,&center_z,N,masses);
  printf("\t Current Center of Mass: [ %.7e, %.7e, %.7e]\n",center_x,center_y,center_z); 
  avgVelocity(N,vel_x,vel_y,vel_z,&avg_vel_x,&avg_vel_y,&avg_vel_z);
  printf("\t Current Average Velocity: [ %.7e, %.7e, %.7e]\n",avg_vel_x,avg_vel_y,avg_vel_z); 

  free(masses);
  free(pos_x);
  free(pos_y);
  free(pos_z);
  free(vel_x);
  free(vel_y);
  free(vel_z);
  free(f_x);
  free(f_y);
  free(f_z);

return 1;
}
