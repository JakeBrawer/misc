CC = mpicc
CFLAGS = -g -O3 -std=c99 -lm -Wall -pedantic

all: serial parallel

serial:	serial.o timing.o
	$(CC) -o $@ $(CFLAGS) $^

parallel:	parallel.o timing.o
	$(CC) -o $@ $(CFLAGS) $^

.c.o:
	$(CC) $(CFLAGS) -c $<

clean:
	rm -f serial parallel *.o
