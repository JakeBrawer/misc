CC = icpc

CFLAGS= -g  -qopenmp -O3 -xHost  -mkl -fno-alias 

#CFLAGS= -g -O0 -xHost -mkl -fno-alias -qopenmp
#CFLAGS= -g -O3  -fopenmp -lm

OPTFLAGS = -qopt-report -qopt-report-file=$@.optrpt 


NSIZE=16384

.SUFFIXES: .o .c

all: clean nbody0_fast nbody0 nbody1 nbody2 nbody3 nbody4_2 nbody4_4 nbody4_8 nbody4_16



nbody0_fast: nbody0.o
	$(CC) -o $@ $(CFLAGS) $^

nbody1: nbody1.o
	$(CC) -o $@ $(CFLAGS) $^

nbody2: nbody2.o
	$(CC)  -o $@ $(CFLAGS) $^ 

nbody3: nbody3.o
	$(CC) -o $@ $(CFLAGS) $^

nbody4_2: nbody4.o
	$(CC) -o $@ $(CFLAGS) -DTILE=2  $^

nbody4_4: nbody4.o
	$(CC) -o $@ $(CFLAGS) -DTILE=4 $^

nbody4_8: nbody4.o
	$(CC) -o $@ $(CFLAGS) -DTILE=8 $^

nbody4_16: nbody4.o
	$(CC) -o $@ $(CFLAGS) -DTILE=16 $^

.c.o:
	$(CC) $(CFLAGS) -c $(OPTFLAGS) -o $@ $< 

clean: 
	rm -f nbody0_*  nbody1 nbody2 nbody3 nbody4 *.o *.optrpt
