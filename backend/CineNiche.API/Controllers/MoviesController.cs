using CineNiche.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CineNiche.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    //[Authorize]
    public class MoviesController : ControllerBase
    {
        private MoviesContext _MoviesDbContext;
        public MoviesController(MoviesContext temp)
        {
            _MoviesDbContext = temp;
        }

        [HttpGet("GetMovies")]
        public IActionResult GetMovies(int pageSize = 50, int pageNum = 2, [FromQuery] List<string>? categories = null)
        {
            try
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

                // Adding a stable ordering clause before Skip/Take

                var totalNumMovies = query.Count();
                var movies = query.ToList()
                    .OrderBy(m =>
                    {
                        var digitsOnly = new string(m.ShowId.SkipWhile(c => !char.IsDigit(c)).ToArray());
                        return int.TryParse(digitsOnly, out var num) ? num : int.MaxValue;
                    })
                    .Skip((pageNum - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

            var returnMovies = new
            {
                Movies = movies,
                TotalMovies = totalNumMovies
            };

            return Ok(returnMovies);
        }
        catch (Exception ex)
        {
            // Log the error and return the exception message for debugging (remove ex.Message in production)
            return StatusCode(500, ex.Message);
        }
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

    // POST: Create a new movie
    [HttpPost("CreateMovie")]
    public IActionResult CreateMovie([FromBody] MoviesTitle movie)
    {
        if (movie == null)
            return BadRequest("Movie data is null.");

        _MoviesDbContext.MoviesTitles.Add(movie);
        _MoviesDbContext.SaveChanges();
        return Ok(movie);
    }

    // PUT: Update an existing movie
    [HttpPut("UpdateMovie/{showId}")]
    public IActionResult UpdateMovie(string showId, [FromBody] MoviesTitle updatedMovie)
    {
        var movie = _MoviesDbContext.MoviesTitles.FirstOrDefault(m => m.ShowId == showId);
        if (movie == null)
            return NotFound($"Movie with ShowId '{showId}' not found.");

        // Update the movie's properties—adjust as needed based on your model.
        movie.Title = updatedMovie.Title;
        movie.Director = updatedMovie.Director;
        movie.Cast = updatedMovie.Cast;
        movie.Country = updatedMovie.Country;
        movie.ReleaseYear = updatedMovie.ReleaseYear;
        movie.Rating = updatedMovie.Rating;
        movie.Duration = updatedMovie.Duration;
        movie.Description = updatedMovie.Description;
        // Update category flags or other properties if applicable.
        _MoviesDbContext.MoviesTitles.Update(movie);
        _MoviesDbContext.SaveChanges();
        return Ok(movie);
    }

    // DELETE: Delete an existing movie
    [HttpDelete("DeleteMovie/{showId}")]
    public IActionResult DeleteMovie(string showId)
    {
        var movie = _MoviesDbContext.MoviesTitles.FirstOrDefault(m => m.ShowId == showId);
        if (movie == null)
            return NotFound($"Movie with ShowId '{showId}' not found.");

        _MoviesDbContext.MoviesTitles.Remove(movie);
        _MoviesDbContext.SaveChanges();
        return Ok();
    }

    [HttpGet("SearchMovies")]
    public IActionResult SearchMovies([FromQuery] string searchTerm)
    {
        var queriedMovies = _MoviesDbContext.MoviesTitles
            .Where(m => m.Title != null && m.Title.Contains(searchTerm))
            .OrderBy(m => m.Title)
            .Take(10)
            .Select(m => new {
                m.ShowId,
                m.Title
            })
            .ToList();
        return Ok(queriedMovies);
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
    public IActionResult SubmitRating([FromBody] MoviesRating rating)
    {
        if (rating.Rating is < 1 or > 5)
        {
            return BadRequest("Rating must be between 1 and 5.");
        }

        if (string.IsNullOrWhiteSpace(rating.ShowId) || rating.UserId == null)
        {
            return BadRequest("ShowId and UserId are required.");
        }

        _MoviesDbContext.MoviesRatings.Add(rating);
        _MoviesDbContext.SaveChanges();

        return Ok(new { message = "Rating submitted successfully." });
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