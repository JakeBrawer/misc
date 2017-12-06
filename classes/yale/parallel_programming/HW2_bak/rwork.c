#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <unistd.h>

int rwork(int rank, int secondsValues) {
    // If rank is 0, non-threadsafely decide on a number of seconds for a worker: 2, 4, or 8.
    if (rank == 0) {
        time_t t;
        srand((unsigned) time(&t));
        int orderValue = 0;
        int chosenValuesMask = 0;
        for (int i = 0; i < 3; i++) {
            while (chosenValuesMask < (2 + 4 + 8)) {
                int choice = rand() % 3;
                int seconds = 1 << (choice + 1);
                if ((chosenValuesMask & seconds) == 0) {
                    //printf("Choosing %d seconds for rank %d /w mask %d\n", seconds, i, chosenValuesMask);
                    chosenValuesMask += seconds;
                    orderValue |= seconds << (i * 4);
                    break;
                }
            }
        }
        
        return orderValue; // times all taken...
    } else {
        // If rank is not 0, wait the number of seconds according to our rank
        int seconds = (secondsValues >> ((rank - 1) * 4)) & 0xf;
        sleep(seconds);
        return seconds;
    }
}