#!/bin/bash
#PBS -l procs=8,tpn=1,mem=34gb
#PBS -l walltime=30:00
#PBS -N Brawer_Task2
#PBS -r n
#PBS -j oe
#PBS -q cpsc424

pwd
#cd $PBS_O_WORKDIR
#pwd
#cat $PBS_NODEFILE
for p in 1 2 4 8
do
    for N in 1000 2000 4000 8000
    do
        echo "N: $N, p:$p"
        mpiexec -n $p task2 $N
    done
done

