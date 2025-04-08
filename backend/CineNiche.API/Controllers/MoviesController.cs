using CineNiche.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using SameSiteMode = Microsoft.AspNetCore.Http.SameSiteMode;

namespace CineNiche.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class MoviesController : ControllerBase
    {
        private MoviesContext _MoviesDbContext;
        public MoviesController(MoviesContext temp)
        {
            _MoviesDbContext = temp;
        }
        [HttpGet("GetMovies")]
        public IActionResult GetMovies(int pageSize = 10, int pageNum = 1, [FromQuery] List<string>? categories = null)
        {
            var query = _MoviesDbContext.MoviesTitles.AsQueryable();

            if (categories != null && categories.Any())
            {
                foreach (var category in categories)
                {
                    switch (category.Trim().ToLower())
                    {
                        case "action":
                            query = query.Where(m => m.Action == 1);
                            break;
                        case "adventure":
                            query = query.Where(m => m.Adventure == 1);
                            break;
                        case "anime series international tv shows":
                            query = query.Where(m => m.AnimeSeriesInternationalTvShows == 1);
                            break;
                        case "british tv shows docuseries international tv shows":
                            query = query.Where(m => m.BritishTvShowsDocuseriesInternationalTvShows == 1);
                            break;
                        case "children":
                            query = query.Where(m => m.Children == 1);
                            break;
                        case "comedies":
                            query = query.Where(m => m.Comedies == 1);
                            break;
                        case "comedies dramas international movies":
                            query = query.Where(m => m.ComediesDramasInternationalMovies == 1);
                            break;
                        case "comedies international movies":
                            query = query.Where(m => m.ComediesInternationalMovies == 1);
                            break;
                        case "comedies romantic movies":
                            query = query.Where(m => m.ComediesRomanticMovies == 1);
                            break;
                        case "crime tv shows docuseries":
                            query = query.Where(m => m.CrimeTvShowsDocuseries == 1);
                            break;
                        case "documentaries":
                            query = query.Where(m => m.Documentaries == 1);
                            break;
                        case "documentaries international movies":
                            query = query.Where(m => m.DocumentariesInternationalMovies == 1);
                            break;
                        case "docuseries":
                            query = query.Where(m => m.Docuseries == 1);
                            break;
                        case "dramas":
                            query = query.Where(m => m.Dramas == 1);
                            break;
                        case "dramas international movies":
                            query = query.Where(m => m.DramasInternationalMovies == 1);
                            break;
                        case "dramas romantic movies":
                            query = query.Where(m => m.DramasRomanticMovies == 1);
                            break;
                        case "family movies":
                            query = query.Where(m => m.FamilyMovies == 1);
                            break;
                        case "fantasy":
                            query = query.Where(m => m.Fantasy == 1);
                            break;
                        case "horror movies":
                            query = query.Where(m => m.HorrorMovies == 1);
                            break;
                        case "international movies thrillers":
                            query = query.Where(m => m.InternationalMoviesThrillers == 1);
                            break;
                        case "international tv shows romantic tv shows tv dramas":
                            query = query.Where(m => m.InternationalTvShowsRomanticTvShowsTvDramas == 1);
                            break;
                        case "kids' tv":
                            query = query.Where(m => m.KidsTv == 1);
                            break;
                        case "language tv shows":
                            query = query.Where(m => m.LanguageTvShows == 1);
                            break;
                        case "musicals":
                            query = query.Where(m => m.Musicals == 1);
                            break;
                        case "nature tv":
                            query = query.Where(m => m.NatureTv == 1);
                            break;
                        case "reality tv":
                            query = query.Where(m => m.RealityTv == 1);
                            break;
                        case "spirituality":
                            query = query.Where(m => m.Spirituality == 1);
                            break;
                        case "tv action":
                            query = query.Where(m => m.TvAction == 1);
                            break;
                        case "tv comedies":
                            query = query.Where(m => m.TvComedies == 1);
                            break;
                        case "tv dramas":
                            query = query.Where(m => m.TvDramas == 1);
                            break;
                        case "talk shows tv comedies":
                            query = query.Where(m => m.TalkShowsTvComedies == 1);
                            break;
                        case "thrillers":
                            query = query.Where(m => m.Thrillers == 1);
                            break;
                        default:
                            break;
                    }
                }
            }

            var totalNumMovies = query.Count();
            var movies = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var returnMovies = new
            {
                Movies = movies,
                TotalNumProjects = totalNumMovies
            };
            
            return Ok(returnMovies);
        }

        [HttpGet("GetCategories")]
        public IActionResult GetCategories()
        {
            var excludedFields = new HashSet<string>
            {
                "ShowId", "Type", "Title", "Director", "Cast", "Country",
                "ReleaseYear", "Rating", "Duration", "Description"
            };

            var categoryNames = typeof(MoviesTitle)
                .GetProperties()
                .Where(p => p.PropertyType == typeof(int?) && !excludedFields.Contains(p.Name))
                .Select(p =>
                    System.Text.RegularExpressions.Regex
                        .Replace(p.Name, "(?<!^)([A-Z])", " $1") // Adds spaces before capital letters
                        .Replace(" Tv", " TV") // Capitalize 'TV'
                        .Replace(" Id", " ID") // Just in case
                        .Trim()
                )
                .ToList();

            return Ok(categoryNames);
        }


    }
}
