/**
 * Writes one line to standard output consisting of the given prefix with the integers
 * 0 through n-1 appended.
 *
 * For testing cooccurrence matrix read context operation.
 */

public class WriteContext
{
    public static void main(String[] args)
    {
	if (args.length < 2)
	    {
		System.err.println("USAGE: java WriteContext [word repeats]...");
		return;
	    }

	for (int i = 0; i + 1 < args.length; i++)
	    {
		String word = args[i];
		int n = Integer.parseInt(args[i + 1]);

		for (int j = 0; j < n; j++)
		    {
			if (i > 0 || j > 0)
			    {
				System.out.print(" ");
			    }
			System.out.print(word);
		    }
	    }
	System.out.println();
    }
}
