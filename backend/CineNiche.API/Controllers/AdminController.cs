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
    //[Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private MoviesContext _MoviesDbContext;

        public AdminController(MoviesContext temp)
        {
            _MoviesDbContext = temp;
        }

        public class MovieDto
        {
            public string ShowId { get; set; }
            public string Type { get; set; }
            public string Title { get; set; }
            public string Director { get; set; }
            public string Cast { get; set; }
            public string Country { get; set; }
            public int? ReleaseYear { get; set; }
            public string Rating { get; set; }
            public string Duration { get; set; }
            public string Description { get; set; }

            // Optional: array to show selected category names
            public List<string> Categories { get; set; }

            // Genre flags
            public int? Action { get; set; }
            public int? Adventure { get; set; }
            public int? AnimeSeriesInternationalTvShows { get; set; }
            public int? BritishTvShowsDocuseriesInternationalTvShows { get; set; }
            public int? Children { get; set; }
            public int? Comedies { get; set; }
            public int? ComediesDramasInternationalMovies { get; set; }
            public int? ComediesInternationalMovies { get; set; }
            public int? ComediesRomanticMovies { get; set; }
            public int? CrimeTvShowsDocuseries { get; set; }
            public int? Documentaries { get; set; }
            public int? DocumentariesInternationalMovies { get; set; }
            public int? Docuseries { get; set; }
            public int? Dramas { get; set; }
            public int? DramasInternationalMovies { get; set; }
            public int? DramasRomanticMovies { get; set; }
            public int? FamilyMovies { get; set; }
            public int? Fantasy { get; set; }
            public int? HorrorMovies { get; set; }
            public int? InternationalMoviesThrillers { get; set; }
            public int? InternationalTvShowsRomanticTvShowsTvDramas { get; set; }
            public int? KidsTv { get; set; }
            public int? LanguageTvShows { get; set; }
            public int? Musicals { get; set; }
            public int? NatureTv { get; set; }
            public int? RealityTv { get; set; }
            public int? Spirituality { get; set; }
            public int? TalkShowsTvComedies { get; set; }
            public int? Thrillers { get; set; }
            public int? TvAction { get; set; }
            public int? TvComedies { get; set; }
            public int? TvDramas { get; set; }
        }

        [HttpPost("CreateMovie")]
        public IActionResult CreateMovie([FromBody] MovieDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var newMovie = new MoviesTitle
            {
                ShowId = dto.ShowId,
                Type = dto.Type,
                Title = dto.Title,
                Director = dto.Director,
                Cast = dto.Cast,
                Country = dto.Country,
                ReleaseYear = dto.ReleaseYear,
                Rating = dto.Rating,
                Duration = dto.Duration,
                Description = dto.Description,

                Action = dto.Action,
                Adventure = dto.Adventure,
                AnimeSeriesInternationalTvShows = dto.AnimeSeriesInternationalTvShows,
                BritishTvShowsDocuseriesInternationalTvShows = dto.BritishTvShowsDocuseriesInternationalTvShows,
                Children = dto.Children,
                Comedies = dto.Comedies,
                ComediesDramasInternationalMovies = dto.ComediesDramasInternationalMovies,
                ComediesInternationalMovies = dto.ComediesInternationalMovies,
                ComediesRomanticMovies = dto.ComediesRomanticMovies,
                CrimeTvShowsDocuseries = dto.CrimeTvShowsDocuseries,
                Documentaries = dto.Documentaries,
                DocumentariesInternationalMovies = dto.DocumentariesInternationalMovies,
                Docuseries = dto.Docuseries,
                Dramas = dto.Dramas,
                DramasInternationalMovies = dto.DramasInternationalMovies,
                DramasRomanticMovies = dto.DramasRomanticMovies,
                FamilyMovies = dto.FamilyMovies,
                Fantasy = dto.Fantasy,
                HorrorMovies = dto.HorrorMovies,
                InternationalMoviesThrillers = dto.InternationalMoviesThrillers,
                InternationalTvShowsRomanticTvShowsTvDramas = dto.InternationalTvShowsRomanticTvShowsTvDramas,
                KidsTv = dto.KidsTv,
                LanguageTvShows = dto.LanguageTvShows,
                Musicals = dto.Musicals,
                NatureTv = dto.NatureTv,
                RealityTv = dto.RealityTv,
                Spirituality = dto.Spirituality,
                TalkShowsTvComedies = dto.TalkShowsTvComedies,
                Thrillers = dto.Thrillers,
                TvAction = dto.TvAction,
                TvComedies = dto.TvComedies,
                TvDramas = dto.TvDramas
            };

            // Save to DB (example using EF Core)
            _MoviesDbContext.MoviesTitles.Add(newMovie);
            _MoviesDbContext.SaveChanges();

            return Ok(newMovie);
        }
        
        [HttpGet("SearchMovies")]
        public async Task<IActionResult> SearchMovies([FromQuery] string query)
        {
            var results = await _MoviesDbContext.MoviesTitles
                .Where(m =>
                    m.Title.Contains(query) ||
                    m.Director.Contains(query) ||
                    m.Cast.Contains(query) ||
                    m.Country.Contains(query) ||
                    m.Description.Contains(query))
                .ToListAsync();

            return Ok(results);
        }


        [HttpGet("GetNextShowId")]
        public IActionResult GetNextShowId()
        {
            var lastMovie = _MoviesDbContext.MoviesTitles
                .Where(m => m.ShowId.StartsWith("s"))
                .OrderByDescending(m => Convert.ToInt32(m.ShowId.Substring(1)))
                .FirstOrDefault();

            int nextId = 1;
            if (lastMovie != null && int.TryParse(lastMovie.ShowId.Substring(1), out int lastNumericId))
            {
                nextId = lastNumericId + 1;
            }

            return Ok($"s{nextId}");
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
