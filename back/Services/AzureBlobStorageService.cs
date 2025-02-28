using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using System.IO;
using System.Threading.Tasks;

public class AzureBlobStorageService
{
    private readonly BlobContainerClient _containerClient;

    public AzureBlobStorageService(IConfiguration configuration)
    {
        // Retrieve settings from appsettings.json
        string connectionString = configuration["AzureBlobStorage:ConnectionString"];
        string containerName = configuration["AzureBlobStorage:ContainerName"];

        var blobServiceClient = new BlobServiceClient(connectionString); // Create a new BlobServiceClient
        _containerClient = blobServiceClient.GetBlobContainerClient(containerName);

        // Create the container if it doesn't exist and set public access level
        _containerClient.CreateIfNotExists(PublicAccessType.Blob);
        // Alternatively, you could await an async version:
        // await _containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob);
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


// REFERNCES :
//[AzureTeach•Net ], “Upload files to Microsoft Azure Blob storage with C# | Azure Storage Account | .Net Core,”
//  YouTube, Feb. 25, 2025. [Online]. 
// Available: https://www.youtube.com/watch?v=HXQYSuBKHCE.
