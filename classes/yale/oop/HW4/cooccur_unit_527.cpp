#include <fstream>
#include <iostream>
#include <vector>
#include <string>
#include <iterator>
#include <algorithm>
#include <unordered_set>
#include <sstream>

#include "cooccur.h"

using namespace std;

#define PRINT_PASSED cout << "PASSED" << endl;
#define PRINT_FAILED cout << "FAILED" << endl;

using CM = cs427_527::CooccurrenceMatrix<string>;

CM make_matrix(string prefix, const int size);
CM make_matrix_keywords(const string& keys, const int size);

//static bool compare_string_vectors(vector<string> a, vector<string> b);
stringstream make_file(const vector<string> words, const vector<string> select, int n);

// Implementing helper functions I was not given
vector<string> make_words(string word, const int size);
vector<string> make_words_select(const vector<string>& keys, const vector<int>& select, const int size);
stringstream make_stream(vector<string> words, vector<int> select, int n);

void test_create();
//void test_create_dynamic(int size);
void test_update_all_keywords(int size);
void test_update_mixed_words(int size);
void test_update_duplicates_in_context(int size);
void test_update_empty_context(int size);
void test_read_only_keywords(int size);
void test_read_all_keywords(int size);
void test_read_mixed_words(int size);
void test_read_duplicate_keywords(int size);
void test_read_empty_line(int size);
void test_read_eof(int size);
void test_read_two_lines(int size);
void test_get_no_occurrences(int size);
void test_get_not_keyword(int size);
void test_get_returns_copy(int size);
//void test_destroy(int size);
void test_all(int size);
void test_template(int size);

void test_create_zero_keywords();
void test_create_duplicate_keywords(int size);
void test_create_space_in_keyword(int size);
void test_update_non_keyword(int size);

void test_create_time(int size);
void test_update_time(int size, int denom);
void test_read_time(int size, istream& in);
void test_get_vector_time(int size, int contexts);

int main(int argc, char **argv)
{
  int test = 0;
  int size = 500;

  if (argc > 1)
    {
      test = atoi(argv[1]);
    }

  if (argc > 2)
    {
      size = atoi(argv[2]);
      if (size < 1)
  {
    cerr << "USAGE: " << argv[0] << "test-number matrix-size" << endl;
  }
    }

  switch (test)
    {
    case 1:
      test_create();
      break;

    case 2:
      //test_create_dynamic(size);
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
      test_read_only_keywords(size); // must write middle keyword to stdin
      break;

    case 8:
      test_read_all_keywords(size); // must write all keywords to stdin
      break;

    case 9:
      test_read_mixed_words(size); // must write all keywords to stdin with non-keywords mixed in
      break;

    case 10:
      test_read_duplicate_keywords(size); // must write first keyword many times to stdin
      break;

    case 11:
      test_read_empty_line(size); // must write blank line to eof
      break;

    case 12:
      test_read_eof(size); // must write 1st keyword w/ no newline to stdin
      break;

    case 13:
      test_read_two_lines(size); // must write 1st keyword then 1st two keywords to stdin}
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
      //test_destroy(size);
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
      test_read_time(size, cin); // repeat this test with different stdin: 100000 copies of 1 of 10000 keywords and 100000 copies of a non-keyword
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

CM make_matrix(string prefix, const int size)
{
  CM cm(make_words(prefix,size));

  return cm;
}


CM make_matrix_keywords(const string& keys, const int size)
{
  CM cm(make_words(keys,size));

  return cm;
}

vector<string> make_words(string word, const int size)
{
  vector<string> return_vec;
  return_vec.reserve(size);

  for (int i = 0; i < size; i++) {
    string new_word = word + to_string(i);
    return_vec.push_back(new_word);
  }
  return return_vec;

}

vector<string> make_words_select(const vector<string>& keys,
                                 const vector<int>& select,
                                 const int size)
{
  vector<string> return_vec;
  return_vec.reserve(size);

  for (int i = 0; i < size; i++) {
    return_vec.push_back(keys[select[i]]);
  }
  return return_vec;
}

void test_create()
{
  // verify create doesn't crash on non-dynamically allocated arrays
  vector<string> keys{"word0", "word1", "word2" };
  CM cm(keys);
  PRINT_PASSED;

  // intentionally not destroying
}

// void test_create_dynamic(int size)
// {
//   // verify create doesn't free the array passed to it (it can't b/c it doesn't know
//   // whether the array was dynamically allocated)
//   vector<string> keys = make_words(string("word"), size);
//   cooccur_create(keys, size);
//   free_words(keys, size);
//   PRINT_PASSED;

//   // intentionally not destroying
// }

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
  vector<string> keys = make_words(string("word"), size);
  CM cm = make_matrix(string("word"), size);

  // update with "word0" then "word0 word1", "word0 word1 word2" ...
  for (int i = 1; i <= size; i++)
    {
      // make context from scratch each time in case students did something untoward to it
      vector<string> context = make_words("word", i);
      unordered_set<string> context_set(context.begin(), context.end());

      cm.update(context_set);
    }

  // test first keyword (1, n-1/n, ..., 1/n)
  vector<double> vec0(cm.getVector(keys[0]));
  for (int i = 0; i < size; i++)
    {
      if (!test_ratio(vec0[i], size - i, size))
  {
    PRINT_FAILED;
    return;
  }
    }

  // test last keyword (all 1.0)
  vector<double> vec_last(cm.getVector(keys[size - 1]));
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
  vector<string> keys = make_words(string("word"), size);
  CM cm(make_matrix(string("word"), size));

  // update with "word0" then "word0 word1", "word0 word1 word2" ... "word0 ... wordsize"
  // (note "wordsize" is not a keyword)
  for (int i = 1; i <= size ; i++)
    {
      // make context from scratch each time in case students did something untoward to it
      unordered_set<string> context(keys.begin(), keys.begin() + i);

      cm.update(context);
    }

  // test first keyword (1, n-1/n, ..., 1/n)
  vector<double> vec0 = cm.getVector(keys[0]);
  for (int i = 0; i < size; i++)
    {
      if (!test_ratio(vec0[i], size - i, size))
        {
          PRINT_FAILED;
          return;
        }
    }

  // test last keyword (all 1.0)
  vector<double> vec_last(cm.getVector(keys[size - 1]));
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

// void test_update_does_not_free(int size)
// {
//   CM cm = make_matrix("word", size);

//   // this is the one place we will test "caller retains ownership"
//   char **context = make_words(string("word"), size);
//   cm.update(m, context, size);
//   free_words(context, size);

//   PRINT_PASSED;

//   // but still intentionally not destroying the matrix
// }

void test_update_duplicates_in_context(int size)
{
  vector<string> keys = make_words(string("word"), size);
  CM cm(keys);

  // make array 0 1 1 ... to select word0 word1 word1 ...
  vector<int> select;
  select.reserve(size);

  select[0] = 0;
  for (int i = 1; i < size; i++)
    {
      select[i] = 1;
    }

  // update with "word0 word1 word1 ..." and then "word0"
  // note we intentionally don't free
  vector<string> update_1(make_words_select(keys, select, size));
  vector<string> update_2(make_words_select(keys, select, 1));

  cm.update(unordered_set<string>(update_1.begin(), update_1.end()));
  cm.update(unordered_set<string>(update_2.begin(), update_2.end()));

  // no crash? then OK

  PRINT_PASSED;

  // intentionally not destroying or freeing
}

void test_update_empty_context(int size)
{
  vector<string> keys = make_words(string("word"), size);
  CM cm(keys);

  // make "word0 word1"
  vector<int> select = {0, 1};
  vector<string> context = make_words_select(keys, select, 2);
  unordered_set<string> context_set(context.begin(), context.end());

  cm.update(context_set);

  // update with empty context; ratios shouldn't change
  unordered_set<string> empty;
  cm.update(empty);

  vector<double> vec0 = cm.getVector(keys[0]);

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

void test_read_only_keywords(int size)
{
  vector<string> words = make_words(string("word"), size);
  CM cm(words);

  // select only middle keyword
  vector<int> select;
  select.push_back(size / 2);

  vector<string> context_correct = make_words_select(words, select, 1);
  unordered_set<string> context_set(context_correct.begin(),
                                    context_correct.end());
  stringstream in(context_correct[0]);

  // make file with middle keyword
  //fstream &fin = make_file("temp_context", words, select, 1);

  // read context from file
  unordered_set<string> context_read = cm.readContext(in);

  // check result
  if (!(context_read == context_set))
    {
      PRINT_FAILED;
    }
  else
    {
      PRINT_PASSED;
    }


  // intentionally not destroying or freeing
}

void test_read_all_keywords(int size)
{
  vector<string> words = make_words(string("word"), size);
  CM cm(words);

  // select all keywords
  vector<int> select;
  select.reserve(size);

  for (int i = 0; i < size; i++)
    {
      select.push_back(i);
    }

  // make file containing "word0 word1..."
  vector<string> context_vec =  make_words_select(words, select, size);
  stringstream context_stream = make_stream(words, select, size);
  unordered_set<string> context_set(context_vec.begin(), context_vec.end());


  // make file containing context
  //fstream &fin = make_file("temp_context", words, select, size);

  // read context from file
  unordered_set<string> context_read = cm.readContext(context_stream);


  // check result
  if (!( context_read == context_set))
    {
      PRINT_FAILED;
    }
  else
    {
      PRINT_PASSED;
    }


  // intentionally not destroying or freeing
}

void test_read_mixed_words(int size)
{
  vector<string> words = make_words(string("words"), size);
  // make extra words for non-keywords
  vector<string> extra_words = make_words(string("words"), size * 2);
  CM cm(words);

  // select "word0 wordsize+1 word1 ..."
  vector<int> select;
  select.reserve(size * 2);

  for (int i = 0; i < size * 2; i++)
    {
      if (i % 2 == 0)
        {
          select.push_back(i / 2);
        }
      else
        {
          select.push_back(size + i);
        }
    }

  // make context "word0 wordsize+1 word1..."
  vector<string> context_correct_vec = words;
  unordered_set<string> context_correct_set(context_correct_vec.begin(),
                                            context_correct_vec.end());

  // make file with that context
  stringstream in = make_stream(extra_words, select, size * 2);

  // read from file
  cout << endl;
  unordered_set<string> context_read = cm.readContext(in);

  // check result
  if (!(context_read == context_correct_set))
    {
      PRINT_FAILED;
    }
  else
    {
      PRINT_PASSED;
    }

  // intentionally not destroying or freeing
}

void test_read_duplicate_keywords(int size)
{
  vector<string> words = make_words(string("word"), size);
  CM cm(words);

  // select "word0 word0 word0..."
  vector<int> select;
  select.reserve(size);

  for (int i = 0; i < size; i++)
    {
      select[i] = 0;
    }

  // make context "word0"
  vector<string> context_correct_vec = make_words_select(words, select, 1);
  unordered_set<string> context_correct_set(context_correct_vec.begin(),
                                            context_correct_vec.end());

  // make file containing "word0 word0 word0..."
  stringstream in;
  for(int i =0; i < size; i++)
    {
      in << context_correct_vec[0] + string(" ");
    }

  in << endl;
  //fstream &fin = make_file("temp_context", words, select, size);

  // read context
  unordered_set<string> context_read = cm.readContext(in);
  //fclose(in);

  // check result
  if (!(context_correct_set == context_read))
    {
      PRINT_FAILED;
    }
  else
    {
      PRINT_PASSED;
    }


  // intentionally not destroying or freeing
}

void test_read_empty_line(int size)
{
  vector<string> words = make_words(string("word"), size);
  CM cm(words);

  // make empty file
  //fstream &fin = make_file("temp_context", words, NULL, 0);

  stringstream in;
  // read context from file
  unordered_set<string> context = cm.readContext(in);
  //fclose(in);

  // check result
  if (context.size() != 0)
    {
      PRINT_FAILED;
    }
  else
    {
      PRINT_PASSED;
    }

  // intentionally not destroying or freeing
}


void test_read_eof(int size)
{
  vector<string> words = make_words(string("word"), size);
  CM cm(words);

  // correct is "word0"
  stringstream in(words[0]);
  unordered_set<string> context_correct(words.begin(), words.begin() + 1);

  // make a file containing "word0" with no newline before EOF
  /*
  fstream &fin = fopen("temp_context", "w");
  fprintf(in, "%s", words[0]);
  fclose(in);
  in = fopen("temp_context", "r");
  */

  unordered_set<string> context_read = cm.readContext(in);

  if (!(context_read == context_correct))
    {
      PRINT_FAILED;
    }
  else
    {
      PRINT_PASSED;
    }

  // intentionally not destroying or freeing
}

void test_read_two_lines(int size)
{
  vector<string> words = make_words(string("word"), size);
  CM cm(words);

  // correct is "word0"
  vector<string> context_correct_1(words.begin(), words.begin() + 1);
  vector<string> context_correct_2 (words.begin(), words.begin() + 2);

  unordered_set<string> context_set_1(context_correct_1.begin(),
                                      context_correct_1.end());
  unordered_set<string> context_set_2(context_correct_2.begin(),
                                      context_correct_2.end());

  stringstream in1(words[0]);
  stringstream in2(words[0] + string(" ") + words[1]);

  // make a file containing "word0" and "word0 word1"
  /*
  fstream &fin = fopen("temp_context", "w");
  fprintf(in, "%s\n%s %s\n", words[0], words[0], words[1]);
  fclose(in);
  */
  //in = fopen("temp_context", "r");

  // read two contexts
  unordered_set<string> context_read_1 = cm.readContext(in1);
  unordered_set<string> context_read_2 = cm.readContext(in2);

  // check results
  if (!(context_set_1 == context_read_1) || !(context_set_2 == context_read_2))
    {
      PRINT_FAILED;
    }
  else
    {
      PRINT_PASSED;
    }


  // intentionally not destroying or freeing
}

void test_get_no_occurrences(int size)
{
  vector<string> keys = make_words(string("word"), size);
  CM cm(keys);

  // get vector for all keywords and verify all 0.0
  for (int i = 0; i < size; i++)
    {
      vector<double> vec = cm.getVector(keys[i]);
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

  // intentionally not destroying or freeing
}

void test_get_not_keyword(int size)
{
  CM cm = make_matrix("word", size);

  // get vector for non-keyword and verify all 0.0
  vector<double> vec0 = cm.getVector(string("wort"));
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
  vector<string> keys = make_words(string("word"), size);
  CM cm(keys);

  // do an update to avoid potential divide by zero
  unordered_set<string> context(keys.begin(), keys.begin() + 1);
  cm.update(context);

  // get vector, write to it, get it again and make sure still correct
  vector<double> vec0 = cm.getVector(keys[0]);
  vec0[0] = 0.0;
  vec0 = cm.getVector(keys[0]);
  if (vec0[0] != 1.0)
    {
      PRINT_FAILED;
      return;
    }

  PRINT_PASSED;

  // intentionally not destroying or freeing
}


void test_all(int size)
{
  vector<string> words = make_words(string("word"), size );
  vector<string> extra_words = make_words(string("word"), size * 2);
  CM cm(words);

  vector<int> select;
  select.reserve(size * 2);

  for (int i = 0; i < size * 2; i++)
    {
      select.push_back(i);
    }
  //fstream &fin = make_file("temp_context", words, select, size * 2);
  stringstream in = make_stream(extra_words, select, size * 2);

  // read context and update
  unordered_set<string> context_read = cm.readContext(in);
  cm.update(context_read);
  //fclose(in);

  for (int i = 1; i < size; i++)
    {
      unordered_set<string> context_set(words.begin(), words.begin() + i);

      cm.update(context_set);
    }

  for (int i = 0; i < size; i++)
    {
      vector<double> vec(cm.getVector(words[i]));
    }

  PRINT_PASSED;
}

void test_create_zero_keywords()
{
  vector<string> keys;
  CM cm(keys);
  PRINT_PASSED;

  // intentionally not destroying or freeing
}

void test_create_duplicate_keywords(int size)
{
  vector<string> words = make_words(string("word"), size);

  // select "word0 word1 word0 word1.." for keywords
  vector<int> select;
  select.reserve(size);

  for (int i = 0; i < size; i++)
    {
      select[i] = i % 2;
    }

  vector<string> keys = make_words_select(words, select, size);
  CM cm(keys);

  // make a context "word0 word1 word0 word1 ..."
  unordered_set<string> context(keys.begin(), keys.end());
  cm.update(context);

  // make context "word0"
  context = unordered_set<string>(keys.begin(), keys.begin() + 1);
  cm.update(context);

  // try to get the vector
  cm.getVector(words[0]);

  // no crash?  then good (don't care about output)
  PRINT_PASSED;

}

void test_create_space_in_keyword(int size)
{
  vector<string> keys = make_words(string("wo rd"), size);
  CM cm(keys);

  stringstream in(string("wo rd0 wo rd3"));
  cm.update(cm.readContext(in));
  // no crash?  then OK
  PRINT_PASSED;

  // intentionally not destroying or freeing
}

void test_update_non_keyword(int size)
{
  vector<string> keys = make_words(string("word"), size);
  CM cm(keys);

  vector<string> new_words = make_words("wort", size);
  stringstream in;

  unordered_set<string> context(new_words.begin(), new_words.end());
  cm.update(context);

  // no crash?  then OK
  PRINT_PASSED;

  // intentionally not destroying or freeing
}

void test_create_time(int size)
{
  vector<string> keys = make_words(string("word"), size);
  CM cm(keys);

  PRINT_PASSED;

  // intentionally not destroying
}

void test_update_time(int size, int denom)
{
  vector<string> keys = make_words(string("word"), size);
  CM cm(keys);

  // make a context containing 1% of the words; add it size/100 times
  vector<int> select;
  select.reserve(size);

  for(int i = 0; i < size; i++)
    {
      select.push_back(i);
    }

  for (int i = 0; i < size / denom; i++)
    {
      stringstream in = make_stream(keys, select, size / denom + 1);
      cm.update(cm.readContext(in));
    }

  vector<double> vec1 = cm.getVector(keys[1]);

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

void test_read_time(int size, istream& in)
{
  CM cm = make_matrix("word", size);

  cm.readContext(in);

  PRINT_PASSED;

  // intentionally not destroying or freeing
}

void test_get_vector_time(int size, int contexts)
{
  if (size < 500)
    {
      cout << "test_get_vector_time: need size >= 500; was " << size << endl;
    }

  vector<string> keys = make_words(string("word"), size);
  CM cm(keys);

  vector<int> select;
  select.reserve(size / 100);

  for (int i = 0; i < size / 100; i++)
    {
      if (i % 2 == 0)
        {
          select.push_back(i / 2);
        }
      else
        {
          select.push_back(size - 1 - i / 2);
        }
    }

  for (int i = 0; i < contexts; i++)
    {
      stringstream in = make_stream(keys, select, size / 100);
      cm.update(cm.readContext(in));
    }

  for (int i = 0; i < size; i++)
    {
      cm.getVector(keys[i]);
    }

  // spot check a few ratios
  vector<double> vec1 = cm.getVector(keys[1]);
  if (vec1[0] != 1.0 || vec1[1] != 1.0 || vec1[size / 2] != 0.0)
    {
      PRINT_FAILED;
    }
  else
    {
      PRINT_PASSED;
    }

}
  void test_template(int size)
  {
    vector<int> keys = {1, 2 ,3, 4, 5};
    CooccurrenceMatrix<int> cm(keys);

    stringstream context("1 2 3 ");

    cm.update(cm.readContext(context));

    cm.getVector(1);

    PRINT_PASSED;
  }
  // intentionally not destroying or freeing



stringstream make_stream(vector<string> words, vector<int> select, int n)
{
  vector<string> select_words = make_words_select(words, select, n);
  stringstream s;

  for(auto it: select_words)
    {
      s << it + string(" ");
    }
  //  copy(select_words.begin(), select_words.end(), ostream_iterator<string>(s));

  s << endl;
  return s;
}

