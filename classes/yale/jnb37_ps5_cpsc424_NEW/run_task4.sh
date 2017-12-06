#!/bin/bash
#PBS -l procs=8,tpn=1,mem=34gb,walltime=30:00
#PBS -N Brawer_Task_4
#PBS -q cpsc424
#PBS -j oe
#PBS -r n



cd $PBS_O_WORKDIR
echo "-------------TITLE 2-------------"
for N in 2048 4096 8192 16384 32768
do
	./nbody4_2 8 $N
done
echo "-------------TITLE 4-------------"
for N in 2048 4096 8192 16384 32768
do
	./nbody4_4 8 $N
done
echo "-------------TITLE 8-------------"
for N in 2048 4096 8192 16384 32768
do
	./nbody4_8 8 $N
done
echo "-------------TITLE 16-------------"
for N in 2048 4096 8192 16384 32768
do
	./nbody4_16 8 $N
done
