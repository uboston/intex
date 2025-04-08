using CineNiche.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using SameSiteMode = Microsoft.AspNetCore.Http.SameSiteMode;

namespace CineNiche.API.Controllers;

[Route("[controller]")]
[ApiController]
[Authorize]
public class RecommendController : ControllerBase
{
    private MoviesContext _MoviesDbContext;

    public RecommendController(MoviesContext temp)
    {
        _MoviesDbContext = temp;
    }
    
    [HttpGet("RecommenderContent")]
    public IActionResult RecommenderContent(string showId = "s1")
    {
        var similarShows = _MoviesDbContext
            .RecommenderContents
            .Where(x => x.ShowId == showId)
            .ToList();

        return Ok(similarShows);
    }
    
    [HttpGet("RecommenderCollabItem")]
    public IActionResult RecommenderCollabItem(string showId = "s1")
    {
        var similarShows = _MoviesDbContext
            .RecommenderCollabItems
            .Where(x => x.ShowId == showId)
            .ToList();

        return Ok(similarShows);
    }
    
    [HttpGet("RecommenderCollabUser")]
    public IActionResult RecommenderCollabUser(int userId = 1)
    {
        var similarShows = _MoviesDbContext
            .RecommenderCollabUsers
            .Where(x => x.UserId == userId)
            .ToList();

        return Ok(similarShows);
    }
}