using CineNiche.API.Data;
using CineNiche.API.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using Microsoft.Extensions.Configuration.UserSecrets;
using Microsoft.Net.Http.Headers;
using SameSiteMode = Microsoft.AspNetCore.Http.SameSiteMode;

namespace CineNiche.API.Controllers;

[Route("[controller]")]
[ApiController]
[Authorize]
public class RecommendController : ControllerBase
{
    private readonly MoviesContext _MoviesDbContext;
    private readonly ApplicationDbContext _AppDbContext;

    public RecommendController(MoviesContext moviesDbContext, ApplicationDbContext appDbContext)
    {
        _MoviesDbContext = moviesDbContext;
        _AppDbContext = appDbContext;
    }
    
    [HttpGet("RecommenderContent")]
    public IActionResult RecommenderContent(string showId = "s1")
    {
        var recommendedMovies = (from rec in _MoviesDbContext.recommender_content
                                join movie in _MoviesDbContext.MoviesTitles
                                on rec.other_show_id equals movie.ShowId
                                where rec.show_id == showId
                                orderby rec.similarity descending
                                select movie)
                                .Take(10)
                                .ToList();

        return Ok(recommendedMovies);
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

    [HttpGet("TopTrending")]
    public IActionResult TopTrending()
    {
        var topRated = _MoviesDbContext.MoviesRatings
            .Where(r => r.Rating != null && r.ShowId != null)
            .GroupBy(r => r.ShowId)
            .Select(group => new
            {
                ShowId = group.Key!,
                AverageRating = group.Average(r => r.Rating!.Value)
            })
            .OrderByDescending(r => r.AverageRating)
            .Take(10)
            .ToList();

        // Join with MoviesTitles to get the movie titles
        var result = topRated
            .Join(_MoviesDbContext.MoviesTitles,
                rating => rating.ShowId,
                movie => movie.ShowId,
                (rating, movie) => new
                {
                    rating.ShowId,
                    movie.Title,
                    rating.AverageRating
                })
            .ToList();

        return Ok(result);
    }

    [HttpGet("TopGenres")]
    public IActionResult TopGenres(string userId = "1")
    {
        /*
        1. Determine if user has rated a movie using MoviesRatings
        2. If the user has not rated a movie, return the default list of 5 genres
        3. If the user has rated a movie, use recommender_collab_user to get the genres of their top recommended movies
        4. Using those genres, get a list of 5 of them
        5. Return list to user
        */
        var userCookieId = User?.Identity?.Name;
        if (!string.IsNullOrEmpty(userCookieId))
        {
            userId = EmailHasher.GetStableHash(userCookieId);
            Console.WriteLine("*****************************************************");
            Console.WriteLine("Cookie Result: " + userCookieId);
            Console.WriteLine("Hashed ID: " + userId);
        }

        // Check if user has rated any movies
        var hasUserRated = _MoviesDbContext.MoviesRatings
            .Any(x => x.UserId == Int32.Parse(userId));

        if (!hasUserRated)
        {
            // Fallback default list
            var fallback = new List<string> { "Action", "Comedies", "Dramas", "Documentaries", "Children", "Spirituality" };
            return Ok(fallback);
        }

        var recommendation = _MoviesDbContext.recommender_collab_user
            .FirstOrDefault(x => x.user_id == userId);

        if (recommendation == null)
        {
            var fallback = new List<string> { "Action", "Comedies", "Dramas", "Documentaries", "Children", "Spirituality" };
            return Ok(fallback);
        }

        // Extract rec_1 through rec_10 into a list
        var showIds = new List<string?>
        {
            recommendation.rec_1,
            recommendation.rec_2,
            recommendation.rec_3,
            recommendation.rec_4,
            recommendation.rec_5,
            recommendation.rec_6,
            recommendation.rec_7,
            recommendation.rec_8,
            recommendation.rec_9,
            recommendation.rec_10
        };

        // Collect up to 5 unique genres
        var genres = new HashSet<string>();
        foreach (var showId in showIds)
        {
            if (showId == null) continue;

            var movie = _MoviesDbContext.MoviesTitles
                .FirstOrDefault(m => m.ShowId == showId);

            if (movie == null) continue;

            // Check which genre flags are set to 1 (or true)
            if (movie.Action == 1) genres.Add("Action");
            if (movie.Adventure == 1) genres.Add("Adventure");
            if (movie.AnimeSeriesInternationalTvShows == 1) genres.Add("Anime Series / International TV Shows");
            if (movie.BritishTvShowsDocuseriesInternationalTvShows == 1) genres.Add("British TV Shows / Docuseries / International TV Shows");
            if (movie.Children == 1) genres.Add("Children");
            if (movie.Comedies == 1) genres.Add("Comedies");
            if (movie.ComediesDramasInternationalMovies == 1) genres.Add("Comedies / Dramas / International Movies");
            if (movie.ComediesInternationalMovies == 1) genres.Add("Comedies / International Movies");
            if (movie.ComediesRomanticMovies == 1) genres.Add("Comedies / Romantic Movies");
            if (movie.CrimeTvShowsDocuseries == 1) genres.Add("Crime TV Shows / Docuseries");
            if (movie.Documentaries == 1) genres.Add("Documentaries");
            if (movie.DocumentariesInternationalMovies == 1) genres.Add("Documentaries / International Movies");
            if (movie.Docuseries == 1) genres.Add("Docuseries");
            if (movie.Dramas == 1) genres.Add("Dramas");
            if (movie.DramasInternationalMovies == 1) genres.Add("Dramas / International Movies");
            if (movie.DramasRomanticMovies == 1) genres.Add("Dramas / Romantic Movies");
            if (movie.FamilyMovies == 1) genres.Add("Family Movies");
            if (movie.Fantasy == 1) genres.Add("Fantasy");
            if (movie.HorrorMovies == 1) genres.Add("Horror Movies");
            if (movie.InternationalMoviesThrillers == 1) genres.Add("International Movies / Thrillers");
            if (movie.InternationalTvShowsRomanticTvShowsTvDramas == 1) genres.Add("International TV Shows / Romantic TV Shows / TV Dramas");
            if (movie.KidsTv == 1) genres.Add("Kids' TV");
            if (movie.LanguageTvShows == 1) genres.Add("Language TV Shows");
            if (movie.Musicals == 1) genres.Add("Musicals");
            if (movie.NatureTv == 1) genres.Add("Nature TV");
            if (movie.RealityTv == 1) genres.Add("Reality TV");
            if (movie.Spirituality == 1) genres.Add("Spirituality");
            if (movie.TvAction == 1) genres.Add("TV Action");
            if (movie.TvComedies == 1) genres.Add("TV Comedies");
            if (movie.TvDramas == 1) genres.Add("TV Dramas");
            if (movie.TalkShowsTvComedies == 1) genres.Add("Talk Shows / TV Comedies");
            if (movie.Thrillers == 1) genres.Add("Thrillers");

            if (genres.Count >= 5)
                break;
        }
        var result = genres.Take(5).ToList();
        Console.WriteLine("*****************************************************");
        Console.WriteLine("Result: " + result); // Debug line

        return Ok(result);
    }

    [HttpGet("RandomGenres")]
    public IActionResult RandomGenres([FromQuery] List<string>? usedGenres = null)
    {
        // Full list of all possible genres
        var allPossibleGenres = new List<string>
        {
            "Action", "Adventure", "Anime Series / International TV Shows",
            "British TV Shows / Docuseries / International TV Shows", "Children", "Comedies",
            "Comedies / Dramas / International Movies", "Comedies / International Movies", "Comedies / Romantic Movies",
            "Crime TV Shows / Docuseries", "Documentaries", "Documentaries / International Movies", "Docuseries",
            "Dramas", "Dramas / International Movies", "Dramas / Romantic Movies", "Family Movies", "Fantasy",
            "Horror Movies", "International Movies / Thrillers", "International TV Shows / Romantic TV Shows / TV Dramas",
            "Kids' TV", "Language TV Shows", "Musicals", "Nature TV", "Reality TV", "Spirituality",
            "TV Action", "TV Comedies", "TV Dramas", "Talk Shows / TV Comedies", "Thrillers"
        };

        // If usedGenres is null, initialize it as an empty list
        usedGenres ??= new List<string>();

        // Filter out provided genres from the list of all possible genres
        var availableGenres = allPossibleGenres.Except(usedGenres).ToList();

        // Check if there are at least two genres left to pick
        if (availableGenres.Count < 2)
        {        
            // If a user has already scrolled through all genres, just keep giving more without checks
            var random = new Random();
            var randomGenres = allPossibleGenres
                .OrderBy(x => random.Next())
                .Take(2)
                .ToList();
            return Ok(randomGenres);
        }
        else
        {
            // Grab two random genres from the available genres list
            var random = new Random();
            var randomGenres = availableGenres
                .OrderBy(x => random.Next())
                .Take(2)
                .ToList();
            return Ok(randomGenres);
        }
    }

    [HttpGet("TrendingOrForYou")]
    public IActionResult TrendingOrForYou(string userId = "1")
    {
        var userCookieId = User?.Identity?.Name;
        if (!string.IsNullOrEmpty(userCookieId))
        {
            userId = EmailHasher.GetStableHash(userCookieId);
            Console.WriteLine("*****************************************************");
            Console.WriteLine("Cookie Result: " + userCookieId);
            Console.WriteLine("Hashed ID: " + userId);
        }

        // Check if user has rated any movies
        var hasUserRated = _MoviesDbContext.MoviesRatings
            .Any(x => x.UserId == Int32.Parse(userId));

        // Case 1: User has rated movies, check if they are in the recommender table
        if (hasUserRated)
        {
            // Fetch user recommendations from the recommender table
            var recommendations = _MoviesDbContext.recommender_collab_user
                .Where(x => x.user_id == userId)
                .SingleOrDefault(); // Use SingleOrDefault to handle case where the user isn't found

            // If the user exists in the recommender table, fetch their movie recommendations
            if (recommendations != null)
            {
                // Get movie titles and all columns for the recommended show IDs
                var movieRecommendations = _MoviesDbContext.MoviesTitles
                    .Where(m => new[] { recommendations.rec_1, recommendations.rec_2, recommendations.rec_3, recommendations.rec_4, recommendations.rec_5, recommendations.rec_6, recommendations.rec_7, recommendations.rec_8, recommendations.rec_9, recommendations.rec_10 }
                    .Contains(m.ShowId))
                    .ToList();

                // Combine recommendations with movie titles
                var recommendedMovies = new List<object>();
                foreach (var recId in new[] { recommendations.rec_1, recommendations.rec_2, recommendations.rec_3, recommendations.rec_4, recommendations.rec_5, recommendations.rec_6, recommendations.rec_7, recommendations.rec_8, recommendations.rec_9, recommendations.rec_10 })
                {
                    var movie = movieRecommendations.FirstOrDefault(m => m.ShowId == recId);
                    if (movie != null)
                    {
                        recommendedMovies.Add(movie); // Add the entire movie record
                    }
                }

                var result = new
                {
                    recommendType = "Recommended For You", // Indicating the path taken
                    moviesList = recommendedMovies // List of recommended movies
                };

                return Ok(result);
            }
        }

        // Case 2: If the user has not rated any movies or they are not in the recommender table, fall back to Top Trending
        return GetTopTrendingMovies();
    }

    private IActionResult GetTopTrendingMovies()
    {
        // Fetch TopTrending movies
        var topRated = _MoviesDbContext.MoviesRatings
            .Where(r => r.Rating != null && r.ShowId != null)
            .GroupBy(r => r.ShowId)
            .Select(group => new
            {
                ShowId = group.Key!,
                AverageRating = group.Average(r => r.Rating!.Value)
            })
            .OrderByDescending(r => r.AverageRating)
            .Skip(35)
            .Take(10)
            .ToList();

        // Join with MoviesTitles to get the entire movie record
        var topTrendingMovies = topRated
            .Join(_MoviesDbContext.MoviesTitles,
                rating => rating.ShowId,
                movie => movie.ShowId,
                (rating, movie) => movie) // Return the entire movie record
            .ToList();

        var result = new
        {
            recommendType = "Top Trending", // Indicating the path taken
            moviesList = topTrendingMovies // List of top trending movies
        };

        return Ok(result);
    }

}