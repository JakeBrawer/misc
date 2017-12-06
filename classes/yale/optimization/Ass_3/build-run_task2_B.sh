#!/bin/bash
#PBS -l procs=8,tpn=2,mem=34gb
#PBS -l walltime=30:00
#PBS -N Brawer_Task2_4_Nodes
#PBS -r n
#PBS -j oe
#PBS -q cpsc424

echo "ROUND ROBIN 4 NODES"
for N in 4000 8000
do
    echo "N: $N, p:8"
    mpiexec --map-by -n 8 task2 $N
done
 
