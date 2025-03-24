using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;


// Reference: Azure Blob Service code originally implemented by Aryan (team member)
public class AzureBlobStorageScheduleService
{
    private readonly BlobContainerClient _containerClient;

    public AzureBlobStorageScheduleService(IConfiguration configuration)
    {
        // Retrieve settings from appsettings.json for schedule image storage
        string connectionString = configuration["AzureBlobStorage_Schedule:ConnectionString"];
        string containerName = configuration["AzureBlobStorage_Schedule:ContainerName"];

        var blobServiceClient = new BlobServiceClient(connectionString);
        _containerClient = blobServiceClient.GetBlobContainerClient(containerName);

        // Create the container if it doesn't exist and set public access level
        _containerClient.CreateIfNotExists(PublicAccessType.Blob);
    }

    public async Task<string> UploadFileAsync(byte[] fileBytes, string fileName)
    {
        var blobClient = _containerClient.GetBlobClient(fileName);
        using (var stream = new MemoryStream(fileBytes))
        {
            await blobClient.UploadAsync(stream, new BlobHttpHeaders { ContentType = "image/jpeg" });
        }
        return blobClient.Uri.ToString();
    }
}
