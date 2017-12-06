#!/bin/bash
#PBS -l procs=1,tpn=1,mem=34gb,walltime=30:00
#PBS -N Brawer_Task_1
#PBS -q cpsc424
#PBS -j oe
#PBS -r n



#mpiexec -n 8 parallel
cd $PBS_O_WORKDIR
./nbody1
