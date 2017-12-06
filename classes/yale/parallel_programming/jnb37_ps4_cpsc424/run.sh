#!/bin/bash
#PBS -l procs=1,tpn=1,mem=34gb,walltime=30:00
#PBS -q cpsc424
#PBS -j oe

# cd $PBS_O_WORKDIR

# module load Langs/Intel/15

#./fserial < /home/fas/hpcprog/ahs3/cpsc424/assignment4/data/testdata1 > ./testdata1_f.out

make
mpiexec -n 8 parallel /home/jake/org/classes/yale/parallel_programming/jnb37_ps4_cpsc424/data/testdata1

