#!/bin/bash
#PBS -l procs=8,tpn=1,mem=34gb,walltime=30:00
#PBS -N Brawer_Task_3
#PBS -q cpsc424
#PBS -j oe
#PBS -r n



cd $PBS_O_WORKDIR
./nbody3 8 2048
./nbody3 8 4096
./nbody3 8 8192
./nbody3 8 
./nbody3 8 32768
