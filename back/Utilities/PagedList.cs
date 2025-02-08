public class PagedList<T>
{
    public int Total { get; set; }
    public int PerPage { get; set; }
    public int CurrentPage { get; set; }
    public int LastPage { get; private set; }
    public string FirstPageUrl { get; set; }
    public string LastPageUrl { get; set; }
    public string NextPageUrl { get; set; }
    public string PrevPageUrl { get; set; }
    public int From { get; set; }
    public int To { get; set; }
    public List<T> Data { get; set; }

    private PagedList(List<T> items, int count, int pageNumber, int pageSize)
    {
        Total = count;
        PerPage = pageSize;
        CurrentPage = pageNumber;
        LastPage = (int)Math.Ceiling(count / (double)pageSize);
        FirstPageUrl = "?page=1";
        LastPageUrl = $"?page={LastPage}";
        NextPageUrl = pageNumber < LastPage ? $"?page={pageNumber + 1}" : "";
        PrevPageUrl = pageNumber > 1 ? $"?page={pageNumber - 1}" : "";
        From = count == 0 ? 0 : (pageNumber - 1) * pageSize + 1;
        To = Math.Min(pageNumber * pageSize, count);
        Data = items;
    }

    public static PagedList<T> Create(IEnumerable<T> source, int pageNumber, int pageSize)
    {
        var count = source.Count();
        var items = source
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        return new PagedList<T>(items, count, pageNumber, pageSize);
    }
}