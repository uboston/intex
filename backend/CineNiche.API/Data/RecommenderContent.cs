
using System.ComponentModel.DataAnnotations;

namespace CineNiche.API.Data;

public partial class RecommenderContent
{
    [Key]
    public string? show_id { get; set; }

    public string? other_show_id { get; set; }

    public double? similarity { get; set; }

}