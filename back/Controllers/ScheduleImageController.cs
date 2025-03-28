using Microsoft.AspNetCore.Mvc;

namespace taekwondo_backend.Controllers
{
    /// Controller for handling image uploads specifically for Schedule-related images.
    /// Referenced implementation from teammate Aryan's AzureBlobStorageService.
    [ApiController]
    [Route("schedule-images")]
    public class ScheduleImagesController : ControllerBase
    {
        private readonly AzureBlobStorageScheduleService _scheduleBlobService;

        public ScheduleImagesController(AzureBlobStorageScheduleService scheduleBlobService)
        {
            _scheduleBlobService = scheduleBlobService;
        }

        public class ScheduleImageUploadDTO
        {
            public string Image { get; set; } = string.Empty;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadScheduleImage([FromBody] ScheduleImageUploadDTO dto)
        {
            if (dto == null || string.IsNullOrEmpty(dto.Image))
            {
                return BadRequest("Image data is required.");
            }

            try
            {
                var base64Data = dto.Image.Contains(",")
                    ? dto.Image.Substring(dto.Image.IndexOf(",") + 1)
                    : dto.Image;

                byte[] imageBytes = Convert.FromBase64String(base64Data);
                var fileName = $"{Guid.NewGuid()}.jpg";

                string fileUrl = await _scheduleBlobService.UploadFileAsync(imageBytes, fileName);

                return Ok(new { fileUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Image upload failed.", details = ex.Message });
            }
        }
    }
}
