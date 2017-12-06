#!/bin/bash
#PBS -l procs=8,tpn=1,mem=34gb,walltime=30:00
#PBS -N Brawer_Task_1
#PBS -q cpsc424
#PBS -j oe
#PBS -r n



cd $PBS_O_WORKDIR
./nbody1
