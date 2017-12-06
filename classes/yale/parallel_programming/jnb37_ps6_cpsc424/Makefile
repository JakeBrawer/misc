# This Makefile assumes the following module files are loaded:
#
# Langs/Intel/15
# GPU/Cuda/8.0
#
# This Makefile will only work if executed on a GPU node.
#

CUDAPATH = /home/apps/fas/GPU/Cuda/8.0

NVCC = $(CUDAPATH)/bin/nvcc -Wno-deprecated-gpu-targets 

NVCCFLAGS = -I$(CUDAPATH)/include -O3

LFLAGS = -L$(CUDAPATH)/lib64 -lcuda -lcudart -lm

# Compiler-specific flags (by default, we always use sm_20)
GENCODE_SM20 = -gencode=arch=compute_20,code=\"sm_20,compute_20\"
GENCODE = $(GENCODE_SM20)

.SUFFIXES : .cu .ptx

BINARIES = matmul task1A task2AandC task1C task1B task2B task3 t

matmul: 
	$(NVCC) $(GENCODE) $(NVCCFLAGS) $(LFLAGS) -o $@ matmul.cu

task1A: 
	$(NVCC) $(GENCODE) $(NVCCFLAGS) $(LFLAGS) -D FP=float -o $@ task1.cu

task1B: 
	$(NVCC) $(GENCODE) $(NVCCFLAGS) $(LFLAGS) -D FP=double -o $@ task1.cu

task1C: 
	$(NVCC) $(GENCODE) $(NVCCFLAGS) $(LFLAGS) -D FP=float -D SERIAL==0 -o $@ task1.cu

task2AandC: 
	$(NVCC) $(GENCODE) $(NVCCFLAGS) $(LFLAGS) -D FP=float -o $@ task2.cu

task2B: 
	$(NVCC) $(GENCODE) $(NVCCFLAGS) $(LFLAGS) -D FP=double -o $@ task2.cu

task3: 
	$(NVCC) $(GENCODE) $(NVCCFLAGS) $(LFLAGS) -D FP=float -o $@ task3.cu

.cu.o:
	$(NVCC) $(GENCODE) $(NVCCFLAGS) -o $@ -c $<

clean:	
	rm -f *.o $(BINARIES)
