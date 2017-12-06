#!/bin/bash
#PBS -l procs=8,tpn=8,mem=34gb,walltime=30:00
#PBS -q cpsc424
#PBS -j oe
#PBS -r n



#mpiexec -n 8 parallel
cd $PBS_O_WORKDIR
echo "nbody0 slow"
./nbody0_slow
echo "nbody0 fast"
./nbody0_fast
