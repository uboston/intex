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
    
    /* [HttpGet("ContentReccomender")]
        public IActionResult ContentReccomender(int showid = 10)
        {
            var foryou = _MoviesDbContext
                .Movie
                .Where()
                ToList()
        }*/
}