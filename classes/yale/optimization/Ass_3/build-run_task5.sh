#!/bin/bash
#PBS -l procs=8,tpn=2,mem=4gb
#PBS -l walltime=30:00
#PBS -N Brawer_Task_4
#PBS -r n
#PBS -j oe
#PBS -q cpsc424

pwd
#cd $PBS_O_WORKDIR
#pwd
#cat $PBS_NODEFILE

echo "TASK 5"
    echo "N: $N, p:8"
    mpiexec --map-by -n 7 task5 737
done
