using CineNiche.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
        public IActionResult GetMovies(int pageSize = 10, int pageNum = 1, [FromQuery] List<string>? categories = null)
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
                            // ... your switch cases for filtering by category ...
                            default:
                                break;
                        }
                    }
                }

                // Adding a stable ordering clause before Skip/Take
                query = query.OrderBy(m => m.ShowId);

                var totalNumMovies = query.Count();
                var movies = query
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

        // NEW ENDPOINT: Get details for a single movie
        [HttpGet("MovieDetails/{movieId}")]
        public IActionResult GetMovieDetails(string movieId)
        {
            var movie = _MoviesDbContext.MoviesTitles.FirstOrDefault(m => m.ShowId == movieId);
            if (movie == null)
                return NotFound($"Movie with ShowId '{movieId}' not found.");

            return Ok(movie);
        }

        // NEW ENDPOINT: Get related movies for a specific movie
        [HttpGet("RelatedMovies/{movieId}")]
        public IActionResult GetRelatedMovies(string movieId)
        {
            // For simplicity, return 10 movies that do not have the given movieId.
            // You can enhance this logic to use categories or other criteria.
            var relatedMovies = _MoviesDbContext.MoviesTitles
                .Where(m => m.ShowId != movieId)
                .Take(10)
                .ToList();

            return Ok(relatedMovies);
        }
    }
}
