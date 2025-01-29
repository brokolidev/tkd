public class PagedList<T> : List<T>
{
    public int CurrentPage { get; private set; } // Current page number requested by user
    public int PageSize { get; private set; } // Number of items per page
    public int TotalItems { get; private set; } // Total number of items in db
    public int TotalPages { get; private set; } // Total number of pages (by pagesize)

    // Set the paginated data 
    public PagedList(List<T> items, int count, int pageNumber, int pageSize)
    {
        TotalItems = count;
        PageSize = pageSize;
        CurrentPage = pageNumber;
        TotalPages = (int)Math.Ceiling(count / (double)pageSize);
        AddRange(items);
    }
    // Method to create a paginated list
    public static PagedList<T> Create(IEnumerable<T> source, int pageNumber, int pageSize)
    {
        var count = source.Count();
        var items = source
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        // Create and return a new PagedList with current data for pagination
        return new PagedList<T>(items, count, pageNumber, pageSize);
    }
}