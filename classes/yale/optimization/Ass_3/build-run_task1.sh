#!/bin/bash
#PBS -l procs=4,tpn=4,mem=34gb
#PBS -l walltime=30:00
#PBS -N Brawer_Serial
#PBS -r n
#PBS -j oe
#PBS -q cpsc424

pwd
#cd $PBS_O_WORKDIR
#pwd
#cat $PBS_NODEFILE
./serial
