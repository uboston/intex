using CineNiche.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration.UserSecrets;
using System;
using System.Collections.Generic;
using System.Linq;
using CineNiche.API.Helpers;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;

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
        

        [HttpGet("GetRatingCategories")]
        public IActionResult GetRatingCategories()
        {
            var ratings = _MoviesDbContext.MoviesTitles
                .Select(m => m.Rating)
                .Where(r => !string.IsNullOrEmpty(r))
                .Distinct()
                .OrderBy(r => r)
                .ToList();

            return Ok(ratings);
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
                        .Replace(p.Name, "(?<!^)([A-Z])", " $1")
                        .Replace(" Tv", " TV")
                        .Replace(" Id", " ID")
                        .Trim()
                )
                .ToList();

            return Ok(categoryNames);
        }
        
        [HttpGet("SearchMovies")]
        public IActionResult SearchMovies([FromQuery] string searchTerm, [FromQuery] List<string>? genres = null)
        {
            var query = _MoviesDbContext.MoviesTitles.AsQueryable();

            // Filter by title
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                query = query.Where(m => m.Title != null && m.Title.Contains(searchTerm));
            }

            // Genre mapping
            var genreToPropertyMap = new Dictionary<string, string>
            {
                { "Action", "Action" },
                { "Adventure", "Adventure" },
                { "Anime Series / International TV Shows", "AnimeSeriesInternationalTvShows" },
                { "British TV Shows / Docuseries / International TV Shows", "BritishTvShowsDocuseriesInternationalTvShows" },
                { "Children", "Children" },
                { "Comedies", "Comedies" },
                { "Comedies / Dramas / International Movies", "ComediesDramasInternationalMovies" },
                { "Comedies / International Movies", "ComediesInternationalMovies" },
                { "Comedies / Romantic Movies", "ComediesRomanticMovies" },
                { "Crime TV Shows / Docuseries", "CrimeTvShowsDocuseries" },
                { "Documentaries", "Documentaries" },
                { "Documentaries / International Movies", "DocumentariesInternationalMovies" },
                { "Docuseries", "Docuseries" },
                { "Dramas", "Dramas" },
                { "Dramas / International Movies", "DramasInternationalMovies" },
                { "Dramas / Romantic Movies", "DramasRomanticMovies" },
                { "Family Movies", "FamilyMovies" },
                { "Fantasy", "Fantasy" },
                { "Horror Movies", "HorrorMovies" },
                { "International Movies / Thrillers", "InternationalMoviesThrillers" },
                { "International TV Shows / Romantic TV Shows / TV Dramas", "InternationalTvShowsRomanticTvShowsTvDramas" },
                { "Kids' TV", "KidsTv" },
                { "Language TV Shows", "LanguageTvShows" },
                { "Musicals", "Musicals" },
                { "Nature TV", "NatureTv" },
                { "Reality TV", "RealityTv" },
                { "Spirituality", "Spirituality" },
                { "TV Action", "TvAction" },
                { "TV Comedies", "TvComedies" },
                { "TV Dramas", "TvDramas" },
                { "Talk Shows / TV Comedies", "TalkShowsTvComedies" },
                { "Thrillers", "Thrillers" }
            };

            if (genres != null && genres.Count != 0)
            {
                foreach (var genre in genres)
                {
                    if (genreToPropertyMap.TryGetValue(genre, out var propertyName))
                    {
                        query = query.Where(m => EF.Property<int>(m, propertyName) == 1);
                    }
                }
            }

            var result = query
                .OrderBy(m => m.Title)
                .Take(20)
                .Select(m => new
                {
                    m.ShowId,
                    m.Title
                })
                .ToList();

            return Ok(result);
        }

        [HttpGet("MovieDetails/{showId}")]
        public IActionResult MovieDetails(string showId)
        {
            var movie = _MoviesDbContext.MoviesTitles
                .Where(m => m.ShowId == showId)
                .Select(m => new
                {
                    m.ShowId,
                    m.Title,
                    m.Director,
                    m.Cast,
                    m.Country,
                    m.ReleaseYear,
                    m.Rating,
                    m.Duration,
                    m.Description
                })
                .FirstOrDefault();

            if (movie == null)
            {
                return NotFound($"No movie found with ShowId: {showId}");
            }

            return Ok(movie);
        }

        [HttpPost("MoviesRating")]
        public IActionResult SubmitRating([FromBody] SubmitRatingDto dto, string userId = "1")
        {
            var userCookieId = User?.Identity?.Name;
            if (!string.IsNullOrEmpty(userCookieId))
            {
                userId = EmailHasher.GetStableHash(userCookieId);
                Console.WriteLine("*****************************************************");
                Console.WriteLine("Cookie Result: " + userCookieId);
                Console.WriteLine("Hashed ID: " + userId);
            }

            if (dto.Rating is < 1 or > 5)
            {
                return BadRequest("Rating must be between 1 and 5.");
            }

            if (string.IsNullOrWhiteSpace(dto.ShowId))
            {
                return BadRequest("ShowId is required.");
            }

            int parsedUserId = Int32.Parse(userId);

            // Check for existing rating
            var existingRating = _MoviesDbContext.MoviesRatings
                .FirstOrDefault(r => r.ShowId == dto.ShowId && r.UserId == parsedUserId);

            if (existingRating != null)
            {
                // Update the existing rating
                existingRating.Rating = dto.Rating;
                _MoviesDbContext.MoviesRatings.Update(existingRating);
            }
            else
            {
                // Create new rating
                var rating = new MoviesRating
                {
                    ShowId = dto.ShowId,
                    Rating = dto.Rating,
                    UserId = parsedUserId
                };
                _MoviesDbContext.MoviesRatings.Add(rating);
            }

            _MoviesDbContext.SaveChanges();

            return Ok(new { message = "Rating submitted successfully." });
        }

        public class SubmitRatingDto
        {
            public string ShowId { get; set; }
            public int Rating { get; set; }
        }

        [HttpGet("ReadRating")]
        public IActionResult ReadRating(string showId, string userId = "1")
        {
            if (string.IsNullOrWhiteSpace(showId))
            {
                return BadRequest("ShowId is required.");
            }

            var userCookieId = User?.Identity?.Name;
            if (!string.IsNullOrEmpty(userCookieId))
            {
                userId = EmailHasher.GetStableHash(userCookieId);
                Console.WriteLine("*****************************************************");
                Console.WriteLine("Cookie Result: " + userCookieId);
                Console.WriteLine("Hashed ID: " + userId);
            }

            var rating = _MoviesDbContext.MoviesRatings
                .FirstOrDefault(r => r.UserId == Int32.Parse(userId) && r.ShowId == showId);

            return Ok(new { rating = rating?.Rating });
        }

        [HttpGet("MoviesByGenre")]
        public IActionResult GetMoviesByGenre([FromQuery] string genre)
        {
            // Mapping genre names to their corresponding property names
            var genreToPropertyMap = new Dictionary<string, string>
            {
                { "Action", "Action" },
                { "Adventure", "Adventure" },
                { "Anime Series / International TV Shows", "AnimeSeriesInternationalTvShows" },
                {
                    "British TV Shows / Docuseries / International TV Shows",
                    "BritishTvShowsDocuseriesInternationalTvShows"
                },
                { "Children", "Children" },
                { "Comedies", "Comedies" },
                { "Comedies / Dramas / International Movies", "ComediesDramasInternationalMovies" },
                { "Comedies / International Movies", "ComediesInternationalMovies" },
                { "Comedies / Romantic Movies", "ComediesRomanticMovies" },
                { "Crime TV Shows / Docuseries", "CrimeTvShowsDocuseries" },
                { "Documentaries", "Documentaries" },
                { "Documentaries / International Movies", "DocumentariesInternationalMovies" },
                { "Docuseries", "Docuseries" },
                { "Dramas", "Dramas" },
                { "Dramas / International Movies", "DramasInternationalMovies" },
                { "Dramas / Romantic Movies", "DramasRomanticMovies" },
                { "Family Movies", "FamilyMovies" },
                { "Fantasy", "Fantasy" },
                { "Horror Movies", "HorrorMovies" },
                { "International Movies / Thrillers", "InternationalMoviesThrillers" },
                {
                    "International TV Shows / Romantic TV Shows / TV Dramas",
                    "InternationalTvShowsRomanticTvShowsTvDramas"
                },
                { "Kids' TV", "KidsTv" },
                { "Language TV Shows", "LanguageTvShows" },
                { "Musicals", "Musicals" },
                { "Nature TV", "NatureTv" },
                { "Reality TV", "RealityTv" },
                { "Spirituality", "Spirituality" },
                { "TV Action", "TvAction" },
                { "TV Comedies", "TvComedies" },
                { "TV Dramas", "TvDramas" },
                { "Talk Shows / TV Comedies", "TalkShowsTvComedies" },
                { "Thrillers", "Thrillers" }
            };

            if (!genreToPropertyMap.ContainsKey(genre))
            {
                return BadRequest("Invalid genre.");
            }

            // Get the corresponding property name for the genre
            var propertyName = genreToPropertyMap[genre];

            // Query your database to get the movies where the corresponding genre property is set to 1
            var movies = _MoviesDbContext.MoviesTitles
                .Where(m => EF.Property<int>(m, propertyName) == 1) // Dynamically access the genre property
                .OrderBy(r => Guid.NewGuid()) // Shuffle the movies to get random ones
                .Take(10) // Limit to 10 movies
                .ToList();

            if (!movies.Any())
            {
                return NotFound($"No movies found for genre: {genre}");
            }

            return Ok(movies);
        }
    }
}