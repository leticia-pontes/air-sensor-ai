using Firebase.Database;
using Firebase.Database.Query;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class DHTController : ControllerBase
{
    private readonly FirebaseClient _client;

    public DHTController(FirebaseClient client)
    {
        _client = client;
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] DeviceDTO deviceData)
    {
        await _client
            .Child("Leituras")
            .PostAsync(deviceData);
        return Ok(deviceData);
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var data = await _client
            .Child("Leituras")
            .OnceAsync<DeviceDto>();

        var list = data.Select(x => x.Object).ToList();
        return Ok(list);
    }
}