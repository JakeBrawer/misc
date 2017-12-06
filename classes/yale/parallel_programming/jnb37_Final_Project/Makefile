CC = mpicc
CFLAGS = -g -O3 -std=c99 -lm -Wall -pedantic

all: serial island stepping_stone

serial:	serial.o timing.o
	$(CC) -o $@ $(CFLAGS) $^

island:	island.o timing.o
	$(CC) -o $@ $(CFLAGS) $^

stepping_stone:	stepping_stone.o timing.o
	$(CC) -o $@ $(CFLAGS) $^

.c.o:
	$(CC) $(CFLAGS) -c $<

clean:
	rm -f serial island stepping_stone serial.o island.o stepping_stone.o
