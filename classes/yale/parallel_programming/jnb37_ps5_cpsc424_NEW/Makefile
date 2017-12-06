CC = gcc

#CFLAGS= -g -O3 -xHost -mkl -fno-alias -qopenmp
#CFLAGS= -g -O0 -xHost -mkl -fno-alias -qopenmp
#CFLAGS= -g -O3  -lm -fopenmp 
CFLAGS = -O3  -lm -ffast-math -fopenmp

#OPTFLAGS = -qopt-report -qopt-report-file=$@.optrpt 

TARGETS = nbody0 
TARGETOBJECTS = nbody0.o

NSIZE=16384

.SUFFIXES: .o .c

all: clean nbody0 nbody1 nbody2 nbody3 nbody4


nbody0: nbody0.o
	$(CC) -o $@ $(CFLAGS) $^

nbody1: nbody1.o
	$(CC) -o $@ $(CFLAGS) $^

nbody2: nbody2.o
	$(CC) -o $@ $(CFLAGS) $^

nbody3: nbody3.o
	$(CC) -o $@ $(CFLAGS) $^

nbody4: nbody4.o
	$(CC) -o $@ $(CFLAGS) -DTILE=8 $^

.c.o:
	$(CC) $(CFLAGS) -c $<

clean: 
	rm -f nbody0 nbody1 nbody2 nbody3 *.o
