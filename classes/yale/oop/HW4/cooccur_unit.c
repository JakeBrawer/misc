#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include <string.h>

#include "smap_test_functions.h"

#include "cooccur.h"

cooccurrence_matrix *make_matrix(const char *prefix, int size);
cooccurrence_matrix *make_matrix_keywords(char * const *keys, int size);
bool compare_string_arrays(char **a1, int sz1, char **a2, int sz2);
FILE *make_file(const char *fname, char * const *words, const int *select, int n);

void test_create();
void test_create_dynamic(int size);
void test_update_all_keywords(int size);
void test_update_mixed_words(int size);
void test_update_duplicates_in_context(int size);
void test_update_empty_context(int size);
void test_read_only_keywords(int size, FILE *in);
void test_read_all_keywords(int size, FILE *in);
void test_read_mixed_words(int size, FILE *in);
void test_read_duplicate_keywords(int size, FILE *in);
void test_read_empty_line(int size, FILE *in);
void test_read_eof(int size, FILE *in);
void test_read_two_lines(int size, FILE *in);
void test_get_no_occurrences(int size);
void test_get_not_keyword(int size);
void test_get_returns_copy(int size);
void test_destroy(int size);
void test_all(int size);
void test_template(int size);

void test_create_zero_keywords();
void test_create_duplicate_keywords(int size);
void test_create_space_in_keyword(int size);
void test_update_non_keyword(int size);

void test_create_time(int size);
void test_update_time(int size, int denom);
void test_read_time(int size);
void test_get_vector_time(int size, int contexts);

int main(int argc, char **argv)
{
  int test = 0;
  int size = 1;

  if (argc > 1)
    {
      test = atoi(argv[1]);
    }

  if (argc > 2)
    {
      size = atoi(argv[2]);
      if (size < 1)
	{
	  fprintf(stderr, "USAGE: %s test-number matrix-size\n", argv[0]);
	}
    }

  switch (test)
    {
    case 1:
      test_create();
      break;
      
    case 2:
      test_create_dynamic(size);
      break;
      
    case 3:
      test_update_all_keywords(size);
      break;
      
    case 4:
      test_update_mixed_words(size);
      break;
      
    case 5:
      test_update_duplicates_in_context(size);
      break;
      
    case 6:
      test_update_empty_context(size);
      break;
      
    case 7:
      if (argc < 4)
	{
	  test_read_only_keywords(size, stdin); // must write middle keyword to stdin
	}
      else
	{
	  FILE *in = fopen(argv[3], "r");
	  test_read_only_keywords(size, in); // must write middle keyword to input file
	  fclose(in);
	}
      break;
      
    case 8:
      test_read_all_keywords(size, stdin); // must write all keywords to stdin
      break;
      
    case 9:
      test_read_mixed_words(size, stdin); // must write all keywords to stdin with non-keywords mixed in
      break;
      
    case 10:
      test_read_duplicate_keywords(size, stdin); // must write first keyword many times to stdin
      break;
      
    case 11:
      test_read_empty_line(size, stdin); // must write blank line to eof
      break;
      
    case 12:
      test_read_eof(size, stdin); // must write 1st keyword w/ no newline to stdin
      break;
      
    case 13:
      test_read_two_lines(size, stdin); // must write 1st keyword then 1st two keywords to stdin}
      break;
      
    case 14:
      test_get_no_occurrences(size);
      break;
      
    case 15:
      test_get_not_keyword(size);
      break;
      
    case 16:
      test_get_returns_copy(size);
      break;
      
    case 17:
      test_destroy(size);
      break;
      
    case 18:
      test_create_zero_keywords();
      break;
      
    case 19:
      test_create_duplicate_keywords(size);
      break;
      
    case 20:
      test_create_space_in_keyword(size); // standard input contains wo rd0 wo rd3
      break;
      
    case 21:
      test_update_non_keyword(size);
      break;

    case 22:
      test_create_time(size); // 15000 takes under a second in my C implementation
      break;

    case 23:
      test_update_time(size, 100); // 13000 (slightly less than case 22)
      break;

    case 24:
      test_update_time(size, 2); // 400
      break;

    case 25:
      test_read_time(size); // repeat this test with different stdin: 100000 copies of 1 of 10000 keywords and 100000 copies of a non-keyword
      break;

    case 26:
      test_get_vector_time(size, 1); // 12000
      break;
      
    case 27:
      test_get_vector_time(size, size); // 4000
      break;

    case 28:
      test_all(size); // write all keywords and many non-keywords to standard input
      break;

    case 29:
      test_template(size);
      break;

    default:
      fprintf(stderr, "USAGE: %s matrix-size test-number\n", argv[0]);
    }
}

cooccurrence_matrix *make_matrix(const char *prefix, int size)
{
  char **keys = make_words(prefix, size);
  cooccurrence_matrix *m = cooccur_create(keys, size);

  // intentionally not freeing (so this is unsuitable for memory leak tests)

  return m;
}

cooccurrence_matrix *make_matrix_keywords(char * const *keys, int size)
{
  cooccurrence_matrix *m = cooccur_create(copy_words(keys, size), size);
  
  // intentionally not freeing (so this is unsuitable for memory leak tests)

  return m;
}

void test_create()
{
  // verify create doesn't crash on non-dynamically allocated arrays
  char *keys[] = { "word0", "word1", "word2" };
  cooccur_create(keys, 3);
  PRINT_PASSED;

  // intentionally not destroying
}

void test_create_dynamic(int size)
{
  // verify create doesn't free the array passed to it (it can't b/c it doesn't know
  // whether the array was dynamically allocated)
  char **keys = make_words("word", size);
  cooccur_create(keys, size);
  free_words(keys, size);
  PRINT_PASSED;

  // intentionally not destroying
}

/**
 * Tests that a given double is equal to a given quotient with some
 * room for the imprecision of floating point numbers.
 */
bool test_ratio(double x, int num, int denom)
{
  return (int)(x * denom + 0.000001) == num;
}

void test_update_all_keywords(int size)
{
  cooccurrence_matrix *m = make_matrix("word", size);
  char **keys = make_words("word", size);

  // update with "word0" then "word0 word1", "word0 word1 word2" ...
  for (int i = 1; i <= size; i++)
    { 
      // make context from scratch each time in case students did something untoward to it
      char **context = make_words("word", i);
      cooccur_update(m, context, i);
    }

  // test first keyword (1, n-1/n, ..., 1/n)
  double *vec0 = cooccur_get_vector(m, keys[0]);
  for (int i = 0; i < size; i++)
    {
      if (!test_ratio(vec0[i], size - i, size))
	{
	  PRINT_FAILED;
	  return;
	}
    }

  // test last keyword (all 1.0)
  double *vec_last = cooccur_get_vector(m, keys[size - 1]);
  for (int i = 0; i < size; i++)
    {
      if (!test_ratio(vec_last[i], 1, 1))
	{
	  PRINT_FAILED;
	  return;
	}
    }

  PRINT_PASSED;
  // intentionally not destroying or freeing
}

void test_update_mixed_words(int size)
{
  cooccurrence_matrix *m = make_matrix("word", size);
  char **keys = make_words("word", size);
  
  // update with "word0" then "word0 word1", "word0 word1 word2" ... "word0 ... wordsize"
  // (note "wordsize" is not a keyword)
  for (int i = 1; i <= size + 1; i++)
    {
      // make context from scratch each time in case students did something untoward to it
      char **context = make_words("word", i);
      cooccur_update(m, context, i);
    }

  // test first keyword (1, n-1/n, ..., 1/n)
  double *vec0 = cooccur_get_vector(m, keys[0]);
  for (int i = 0; i < size; i++)
    {
      if (!test_ratio(vec0[i], size - i, size))
	{
	  PRINT_FAILED;
	  return;
	}
    }

  // test last keyword (all 1.0)
  double *vec_last = cooccur_get_vector(m, keys[size - 1]);
  for (int i = 0; i < size; i++)
    {
      if (!test_ratio(vec_last[i], 1, 1))
	{
	  PRINT_FAILED;
	  return;
	}
    }

  PRINT_PASSED;
  // intentionally not destroying or freeing
}

void test_update_does_not_free(int size)
{
  cooccurrence_matrix *m = make_matrix("word", size);

  // this is the one place we will test "caller retains ownership"
  char **context = make_words("word", size);
  cooccur_update(m, context, size);
  free_words(context, size);

  PRINT_PASSED;

  // but still intentionally not destroying the matrix
}

void test_update_duplicates_in_context(int size)
{
  char **keys = make_words("word", size);
  cooccurrence_matrix *m = make_matrix_keywords(keys, size);

  // make array 0 1 1 ... to select word0 word1 word1 ...
  int *select = malloc(sizeof(int) * size);
  select[0] = 0;
  for (int i = 1; i < size; i++)
    {
      select[i] = 1;
    }

  // update with "word0 word1 word1 ..." and then "word0"
  // note we intentionally don't free
  cooccur_update(m, make_words_select(keys, select, size), size);
  cooccur_update(m, make_words_select(keys, select, 1), 1);
  free(select);

  // no crash? then OK
  
  PRINT_PASSED;

  // intentionally not destroying or freeing
}

void test_update_empty_context(int size)
{
  char **keys = make_words("word", size);
  cooccurrence_matrix *m = make_matrix_keywords(keys, size);

  // make "word0 word1"
  int select[] = {0, 1};
  char **context = make_words_select(keys, select, 2);
  cooccur_update(m, context, 2);

  // update with empty context; ratios shouldn't change
  char **empty = malloc(1);
  cooccur_update(m, empty, 0);
  
  double *vec0 = cooccur_get_vector(m, keys[0]);
  free_words(keys, size);
  
  if (vec0[0] != 1.0 || vec0[1] != 1.0)
    {
      PRINT_FAILED;
      return;
    }
  for (int i = 2; i < size; i++)
    {
      if (vec0[i] != 0.0)
	{
	  PRINT_FAILED;
	  return;
	}
    }
  
  PRINT_PASSED;
  
  // intentionally not destroying or freeing
}

void test_read_only_keywords(int size, FILE *in)
{
  char **words = make_words("word", size);
  cooccurrence_matrix *m = make_matrix_keywords(words, size);

  // select only middle keyword
  int *select = malloc(sizeof(int) * 1);
  select[0] = size / 2;
  char **context_correct = make_words_select(words, select, 1);

  // make file with middle keyword
  //FILE *in = make_file("temp_context", words, select, 1);
  free_words(words, size);
  free(select);
  
  // read context from file
  int context_size = 0;
  char **context_read = cooccur_read_context(m, in, &context_size);
  //fclose(in);

  // check result
  if (!compare_string_arrays(context_correct, 1, context_read, context_size))
    {
      PRINT_FAILED;
    }
  else
    {
      PRINT_PASSED;
    }

  free_words(context_correct, 1);

  // intentionally not destroying or freeing
}

void test_read_all_keywords(int size, FILE *in)
{
  char **words = make_words("word", size);
  cooccurrence_matrix *m = make_matrix_keywords(words, size);

  // select all keywords
  int *select = malloc(sizeof(int) * size);
  for (int i = 0; i < size; i++)
    {
      select[i] = i;
    }

  // make file containing "word0 word1..."
  char **context_correct = make_words_select(words, select, size);

  // make file containing context
  //FILE *in = make_file("temp_context", words, select, size);
  free_words(words, size);
  free(select);

  // read context from file
  int context_size = 0;
  char **context_read = cooccur_read_context(m, in, &context_size);
  //fclose(in);

  // check result
  if (!compare_string_arrays(context_correct, size, context_read, context_size))
    {
      PRINT_FAILED;
    }
  else
    {
      PRINT_PASSED;
    }

  free_words(context_correct, size);

  // intentionally not destroying or freeing
}

void test_read_mixed_words(int size, FILE *in)
{
  char **words = make_words("word", size * 2); // make extra words for non-keywords
  cooccurrence_matrix *m = make_matrix_keywords(words, size);

  // select "word0 wordsize+1 word1 ..."
  int *select = malloc(sizeof(int) * size * 2);
  for (int i = 0; i < size * 2; i++)
    {
      if (i % 2 == 0)
	{
	  select[i] = i / 2;
	}
      else
	{
	  select[i] = size + i;
	}
    }

  // make context "word0 wordsize+1 word1..."
  char **context_correct = copy_words(words, size);

  // make file with that context
  //FILE *in = make_file("temp_context", words, select, size);
  free(select);
  free_words(words, size * 2);

  // read from file
  int context_size = 0;
  char **context_read = cooccur_read_context(m, in, &context_size);
  //fclose(in);

  // check result
  if (!compare_string_arrays(context_correct, size, context_read, context_size))
    {
      PRINT_FAILED;
    }
  else
    {
      PRINT_PASSED;
    }

  free_words(context_correct, size);

  // intentionally not destroying or freeing
}

void test_read_duplicate_keywords(int size, FILE *in)
{
  char **words = make_words("word", size);
  cooccurrence_matrix *m = make_matrix_keywords(words, size);

  // select "word0 word0 word0..."
  int *select = malloc(sizeof(int) * size);
  for (int i = 0; i < size; i++)
    {
      select[i] = 0;
    }

  // make context "word0"
  char **context_correct = make_words_select(words, select, 1);

  // make file containing "word0 word0 word0..."
  //FILE *in = make_file("temp_context", words, select, size);
  free(select);
  free_words(words, size);

  // read context
  int context_size = 0;
  char **context_read = cooccur_read_context(m, in, &context_size);
  //fclose(in);

  // check result
  if (!compare_string_arrays(context_correct, 1, context_read, context_size))
    {
      PRINT_FAILED;
    }
  else
    {
      PRINT_PASSED;
    }

  free_words(context_correct, 1);

  // intentionally not destroying or freeing
}

void test_read_empty_line(int size, FILE *in)
{
  char **words = make_words("word", size);
  cooccurrence_matrix *m = make_matrix_keywords(words, size);

  // make empty file
  //FILE *in = make_file("temp_context", words, NULL, 0);
  free_words(words, size);

  // read context from file
  int context_size = 0;
  cooccur_read_context(m, in, &context_size);
  //fclose(in);

  // check result
  if (context_size != 0)
    {
      PRINT_FAILED;
    }
  else
    {
      PRINT_PASSED;
    }
  
  // intentionally not destroying or freeing
}

void test_read_eof(int size, FILE *in)
{
  char **words = make_words("word", size);
  cooccurrence_matrix *m = make_matrix_keywords(words, size);

  // correct is "word0"
  char **context_correct = copy_words(words, 1);

  // make a file containing "word0" with no newline before EOF
  /*
  FILE *in = fopen("temp_context", "w");
  fprintf(in, "%s", words[0]);
  fclose(in);
  in = fopen("temp_context", "r");
  */

  int context_size = 0;
  char **context_read = cooccur_read_context(m, in, &context_size);
  free_words(words, size);
  fclose(in);

  if (!compare_string_arrays(context_correct, 1, context_read, context_size))
    {
      PRINT_FAILED;
    }
  else
    {
      PRINT_PASSED;
    }

  free_words(context_correct, 1);

  // intentionally not destroying or freeing
}

void test_read_two_lines(int size, FILE *in)
{
  char **words = make_words("word", size);
  cooccurrence_matrix *m = make_matrix_keywords(words, size);

  // correct is "word0"
  char **context_correct_1 = copy_words(words, 1);
  char **context_correct_2 = copy_words(words, 2);

  // make a file containing "word0" and "word0 word1"
  /*
  FILE *in = fopen("temp_context", "w");
  fprintf(in, "%s\n%s %s\n", words[0], words[0], words[1]);
  fclose(in);
  */
  free_words(words, size);
  //in = fopen("temp_context", "r");

  // read two contexts
  int context_size_1 = 0;
  int context_size_2 = 0;
  char **context_read_1 = cooccur_read_context(m, in, &context_size_1);
  char **context_read_2 = cooccur_read_context(m, in, &context_size_2);
  //fclose(in);

  // check results
  if (!compare_string_arrays(context_correct_1, 1, context_read_1, context_size_1)
      || !compare_string_arrays(context_correct_2, 2, context_read_2, context_size_2))
    {
      PRINT_FAILED;
    }
  else
    {
      PRINT_PASSED;
    }

  free_words(context_correct_1, 1);
  free_words(context_correct_2, 2);

  // intentionally not destroying or freeing
}

void test_get_no_occurrences(int size)
{
  char **keys = make_words("word", size);
  cooccurrence_matrix *m = make_matrix_keywords(keys, size);
  
  // get vector for all keywords and verify all 0.0
  for (int i = 0; i < size; i++)
    {
      double *vec = cooccur_get_vector(m, keys[i]);
      for (int j = 0; j < size; j++)
	{
	  if (vec[j] != 0.0)
	    {
	      PRINT_FAILED;
	      return;
	    }
	}
    }
  
  PRINT_PASSED;

  free_words(keys, size);
  // intentionally not destroying or freeing
}

void test_get_not_keyword(int size)
{
  cooccurrence_matrix *m = make_matrix("word", size);

  // get vector for non-keyword and verify all 0.0
  double *vec0 = cooccur_get_vector(m, "wort");
  for (int i = 0; i < size; i++)
    {
      if (vec0[i] != 0.0)
	{
	  PRINT_FAILED;
	  return;
	}
    }
  
  PRINT_PASSED;
  
  // intentionally not destroying or freeing
}

void test_get_returns_copy(int size)
{
  char **keys = make_words("word", size);
  cooccurrence_matrix *m = make_matrix_keywords(keys, size);

  // do an update to avoid potential divide by zero
  char **context = copy_words(keys, 1);
  cooccur_update(m, context, 1);

  // get vector, write to it, get it again and make sure still correct
  double *vec0 = cooccur_get_vector(m, keys[0]);
  vec0[0] = 0.0;
  vec0 = cooccur_get_vector(m, keys[0]);
  if (vec0[0] != 1.0)
    {
      PRINT_FAILED;
      return;
    }
  
  PRINT_PASSED;

  free_words(keys, size);
  // intentionally not destroying or freeing
}

void test_destroy(int size)
{
  // the one place we test destroy
  cooccurrence_matrix *m = make_matrix("word", size);
  cooccur_destroy(m);
  PRINT_PASSED;
  // but we still intentionally don't free keywords
}

void test_all(int size)
{
  char **words = make_words("word", size * 2);
  cooccurrence_matrix *m = cooccur_create(words, size);

  int *select = malloc(sizeof(int) * size * 2);
  for (int i = 0; i < size * 2; i++)
    {
      select[i] = i;
    }
  //FILE *in = make_file("temp_context", words, select, size * 2);
  free(select);

  // read context and update
  int context_size = 0;
  char **context_read = cooccur_read_context(m, stdin, &context_size);
  cooccur_update(m, context_read, context_size);
  free_words(context_read, context_size);
  //fclose(in);
  
  for (int i = 0; i < size; i++)
    {
      char **context = copy_words(words, i);
      cooccur_update(m, context, i);
      free_words(context, i);
    }

  for (int i = 0; i < size; i++)
    {
      double *vec = cooccur_get_vector(m, words[i]);
      free(vec);
    }

  free_words(words, size * 2);
  cooccur_destroy(m);

  PRINT_PASSED;
}

void test_create_zero_keywords()
{
  char **keys = malloc(1);
  cooccur_create(keys, 0);
  PRINT_PASSED;

  // intentionally not destroying or freeing
}

void test_create_duplicate_keywords(int size)
{
  char **words = make_words("word", size);
  
  // select "word0 word1 word0 word1.." for keywords
  int *select = malloc(sizeof(int) * size);
  for (int i = 0; i < size; i++)
    {
      select[i] = i % 2;
    }

  char **keys = make_words_select(words, select, size);
  cooccurrence_matrix *m = cooccur_create(keys, size);

  // make a context "word0 word1 word0 word1 ..."
  char **context = make_words_select(words, select, size);
  cooccur_update(m, context, size);

  // make context "word0"
  context = make_words_select(words, select, 1);
  cooccur_update(m, context, 1);

  // try to get the vector
  cooccur_get_vector(m, words[0]);

  // no crash?  then good (don't care about output)
  PRINT_PASSED;

  free_words(words, size);
  // intentionally not destroying or freeing
}

void test_create_space_in_keyword(int size)
{
  char **keys = make_words("wo rd", size);
  cooccurrence_matrix *m = cooccur_create(keys, 0);

  int context_size;
  char **context = cooccur_read_context(m, stdin, &context_size);
  cooccur_update(m, context, context_size);

  // no crash?  then OK
  PRINT_PASSED;

  // intentionally not destroying or freeing
}

void test_update_non_keyword(int size)
{
  char **keys = make_words("word", size);
  cooccurrence_matrix *m = cooccur_create(keys, 0);

  char **context = make_words("wort", size);
  cooccur_update(m, context, size);

  // no crash?  then OK
  PRINT_PASSED;

  // intentionally not destroying or freeing
}

void test_create_time(int size)
{
  char **keys = make_words("word", size);
  cooccur_create(keys, size);

  PRINT_PASSED;

  // intentionally not destroying
}

void test_update_time(int size, int denom)
{
  char **keys = make_words("word", size);
  cooccurrence_matrix *m = make_matrix_keywords(keys, size);

  // make a context containing 1% of the words; add it size/100 times
  for (int i = 0; i < size / denom; i++)
    {
      char **context = copy_words(keys, size / denom + 1);
      cooccur_update(m, context, size / denom + 1);
    }

  double *vec1 = cooccur_get_vector(m, keys[1]);

  // spot check a few coocurrence ratios
  if (vec1[0] != 1.0 || vec1[1] != 1.0 || vec1[size - 1] != 0.0)
    {
      PRINT_FAILED;
    }
  else
    {
      PRINT_PASSED;
    }

  // intentionally not destroying or freeing
}

void test_read_time(int size)
{
  cooccurrence_matrix *m = make_matrix("word", size);

  int context_size = 0;
  cooccur_read_context(m, stdin, &context_size);

  PRINT_PASSED;

  // intentionally not destroying or freeing
}

void test_get_vector_time(int size, int contexts)
{
  if (size < 500)
    {
      printf("test_get_vector_time: need size >= 500; was %d\n", size);
    }
  
  char **keys = make_words("word", size);
  cooccurrence_matrix *m = make_matrix_keywords(keys, size);

  int *select = malloc(sizeof(int) * (size / 100));
  for (int i = 0; i < size / 100; i++)
    {
      if (i % 2 == 0)
	{
	  select[i] = i / 2;
	}
      else
	{
	  select[i] = size - 1 - i / 2;
	}
    }
  
  for (int i = 0; i < contexts; i++)
    {
      char **context = make_words_select(keys, select, size / 100);
      cooccur_update(m, context, size / 100);
    }

  for (int i = 0; i < size; i++)
    {
      cooccur_get_vector(m, keys[i]);
    }

  // spot check a few ratios
  double *vec1 = cooccur_get_vector(m, keys[1]);
  if (vec1[0] != 1.0 || vec1[1] != 1.0 || vec1[size / 2] != 0.0)
    {
      PRINT_FAILED;
    }
  else
    {
      PRINT_PASSED;
    }

  // intentionally not destroying or freeing
}

int compare_strings(const void *p1, const void *p2)
{
  const char * const *s1 = p1;
  const char * const *s2 = p2;

  return strcmp(*s1, *s2);
}

bool compare_string_arrays(char **a1, int sz1, char **a2, int sz2)
{
  if (sz1 != sz2)
    {
      return false;
    }
  else
    {
      qsort(a1, sz1, sizeof(char *), compare_strings);
      qsort(a2, sz2, sizeof(char *), compare_strings);

      for (int i = 0; i < sz1; i++)
	{
	  if (strcmp(a1[i], a2[i]) != 0)
	    {
	      return false;
	    }
	}

      return true;
    }
}

FILE *make_file(const char *fname, char * const *words, const int *select, int n)
{
  FILE *fp = fopen(fname, "w");
  for (int i = 0; i < n; i++)
    {
      if (i > 0)
        {
          fprintf(fp, " ");
        }
      
      fprintf(fp, "%s", words[select[i]]);
    }
  fprintf(fp, "\n");
  fclose(fp);
  
  return fopen(fname, "r");
}


