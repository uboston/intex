using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using CineNiche.API.Data;


namespace CineNiche.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private MoviesContext _MoviesDbContext;

        public AdminController(MoviesContext temp)
        {
            _MoviesDbContext = temp;
        }

        [HttpPost("CreateMovie")]
        public IActionResult CreateMovie([FromBody] MoviesTitle movie)
        {
            if (movie == null)
                return BadRequest("Movie data is null.");

            var lastMovie = _MoviesDbContext.MoviesTitles
                .Where(m => m.ShowId.StartsWith("s"))
                .OrderByDescending(m => Convert.ToInt32(m.ShowId.Substring(1)))
                .FirstOrDefault();

            int nextId = 1;
            if (lastMovie != null && int.TryParse(lastMovie.ShowId.Substring(1), out int lastId))
            {
                nextId = lastId + 1;
            }

            movie.ShowId = $"s{nextId}";

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
    }
}
