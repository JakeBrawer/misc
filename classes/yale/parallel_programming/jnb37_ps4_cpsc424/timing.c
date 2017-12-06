#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <sys/time.h>

void timing(double* wcTime, double* cpuTime) {
    // Wall clock time
    struct timeval now;
    if (gettimeofday(&now, NULL)) {
        fprintf(stderr, "Retrieving system time failed.\n");
        exit(EXIT_FAILURE);
    }
    *wcTime = now.tv_sec + (double)now.tv_usec / 1000000.0;
    
    // CPU time
    *cpuTime = (double)clock() / CLOCKS_PER_SEC;
}