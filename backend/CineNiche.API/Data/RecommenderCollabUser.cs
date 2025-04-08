
using System.ComponentModel.DataAnnotations;

namespace CineNiche.API.Data;

public partial class RecommenderCollabUser
{
    [Key]
    public string? user_id { get; set; }

    public string? rec_1 { get; set; }

    public string? rec_2 { get; set; }

    public string? rec_3 { get; set; }

    public string? rec_4 { get; set; }

    public string? rec_5 { get; set; }

    public string? rec_6 { get; set; }

    public string? rec_7 { get; set; }

    public string? rec_8 { get; set; }

    public string? rec_9 { get; set; }

    public string? rec_10 { get; set; }

}