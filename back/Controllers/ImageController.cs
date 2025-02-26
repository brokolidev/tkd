using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace taekwondo_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImagesController : ControllerBase
    {
        private readonly AzureBlobStorageService _blobService;

        // Use dependency injection to receive the AzureBlobStorageService.
        public ImagesController(AzureBlobStorageService blobService)
        {
            _blobService = blobService;
        }

        public class ImageUploadDTO
        {
            public string Image { get; set; } = string.Empty;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadImage([FromBody] ImageUploadDTO dto)
        {
            if (dto == null || string.IsNullOrEmpty(dto.Image))
            {
                return BadRequest("Image data is required.");
            }

            try
            {
                // Remove any data URL metadata if present.
                var base64Data = dto.Image.Contains(",")
                    ? dto.Image.Substring(dto.Image.IndexOf(",") + 1)
                    : dto.Image;
                byte[] imageBytes = Convert.FromBase64String(base64Data);

                // Generate a unique file name.
                var fileName = $"{Guid.NewGuid()}.jpg";
                string fileUrl = await _blobService.UploadFileAsync(imageBytes, fileName);

                return Ok(new { fileUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Image upload failed.", details = ex.Message });
            }
        }
    }
}
