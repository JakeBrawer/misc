#!/bin/bash
#PBS -I
#PBS -l nodes=compute-31-1:ppn=8,mem=34gb,walltime=2:00:00
#PBS -q cpsc424
#PBS -j oe
#PBS -r n
#PBS -N Brawer_8_Cores



#cd $PBS_O_WORKDIR
echo "------------------------------Serial Code------------------------------"
echo ""
./serial 4 50 40 100000 
./serial 4 .5 40 100000
./serial 5 1000000000 40 100000
./serial 5 10000000 40 100000

echo ""
echo "\n------------------------------Island  Code------------------------------"
echo ""
mpiexec -n 2 ./island 4 50 40 100000
mpiexec -n 2 ./island 4 .5 40 100000
mpiexec -n 2 ./island 5 1000000000 40 100000
mpiexec -n 2 ./island 5 10000000 40 100000 

echo ""
echo "\n------------------------------Stepping Stone  Code------------------------------"
echo ""
mpiexec -n 2 ./stepping_stone 4 50 40 100000
mpiexec -n 2 ./stepping_stone 4 0.5 40 100000
mpiexec -n 2 ./stepping_stone 5 1000000000 40 100000
mpiexec -n 2 ./stepping_stone 5 10000000 40 100000
