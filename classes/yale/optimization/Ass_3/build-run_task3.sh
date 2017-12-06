#!/bin/bash
#PBS -l procs=8,tpn=1,mem=4gb
#PBS -l walltime=30:00
#PBS -N Brawer_Task_3
#PBS -r n
#PBS -j oe
#PBS -q cpsc424

pwd
#cd $PBS_O_WORKDIR
#pwd
#cat $PBS_NODEFILE

echo "NONBLOCKING"
for N in 4000 8000
do
    echo "N: $N, p:8"
    mpiexec -n 8 task3 $N
done
