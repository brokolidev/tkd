using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace taekwondo_backend.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class ImagesController : ControllerBase
    {
        private readonly AzureBlobStorageService _blobService;

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
                // Remove data URL prefix if present.
                var base64Data = dto.Image.Contains(",")
                    ? dto.Image.Substring(dto.Image.IndexOf(",") + 1)
                    : dto.Image;
                byte[] imageBytes = Convert.FromBase64String(base64Data);

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