TIMINGDIR = /home/jake/org/classes/yale/parallel_programming/HW2_bak/
CC = mpicc
CFLAGS = -g -O3 -I$(TIMINGDIR)

all: serial task2 task3 task4

serial:	serial.o matmul.o $(TIMINGDIR)/timing.o
	$(CC) -o $@ $(CFLAGS) $^

task2: task2.o matmul.o $(TIMINGDIR)/timing.o
	$(CC) -o $@ $(CFLAGS) $^

task3: task3.o matmul.o $(TIMINGDIR)/timing.o
	$(CC) -o $@ $(CFLAGS) $^

task4: task4.o matmul.o $(TIMINGDIR)/timing.o
	$(CC) -o $@ $(CFLAGS) $^ -lm

.c.o:
	$(CC) $(CFLAGS) -c $<

clean:
	rm -f serial *.o
