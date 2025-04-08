using CineNiche.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using SameSiteMode = Microsoft.AspNetCore.Http.SameSiteMode;

namespace CineNiche.API.Controllers;

[Route("[controller]")]
[ApiController]
// [Authorize]
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
            .recommender_content
            .Where(x => x.show_id == showId)
            .ToList();

        return Ok(similarShows);
    }
    
    [HttpGet("RecommenderCollabItem")]
    public IActionResult RecommenderCollabItem(string showId = "s1004")
    {
        var similarShows = _MoviesDbContext
            .recommender_collab_item
            .Where(x => x.show_id == showId)
            .ToList();

        return Ok(similarShows);
    }
    
    [HttpGet("RecommenderCollabUser")]
    public IActionResult RecommenderCollabUser(string userId = "1")
    {
        var similarShows = _MoviesDbContext
            .recommender_collab_user
            .Where(x => x.user_id == userId)
            .ToList();

        return Ok(similarShows);
    }
}