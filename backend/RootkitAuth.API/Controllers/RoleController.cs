using Microsoft.AspNetCore.Mvc;

namespace RootkitAuth.API.Controllers;

public class RoleController : Controller
{
    // GET
    public IActionResult Index()
    {
        return View();
    }
}