using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;

namespace CineNiche.API.Controllers;

[Route("[controller]")]
[ApiController]
[Authorize(Roles = "SuperAdmin")]
public class RoleController : Controller
{
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly UserManager<IdentityUser> _userManager;

    public RoleController(RoleManager<IdentityRole> roleManager, UserManager<IdentityUser> userManager)
    {
        _roleManager = roleManager;
        _userManager = userManager;
    }

    [HttpPost("AddRole")]
    public async Task<IActionResult> AddRole([FromQuery] string roleName)
    {
        if (string.IsNullOrWhiteSpace(roleName))
        {
            return BadRequest("Role name cannot be empty.");
        }

        var roleExists = await _roleManager.RoleExistsAsync(roleName);
        if (roleExists)
        {
            return Conflict("Role already exists.");
        }

        var result = await _roleManager.CreateAsync(new IdentityRole(roleName));
        if (result.Succeeded)
        {
            return Ok($"Role '{roleName}' created successfully.");
        }

        return StatusCode(500, "An error occurred while creating the role.");
    }

    [HttpPut("AssignRoleToUser")]
    public async Task<IActionResult> AssignRoleToUser([FromQuery] string userEmail, [FromQuery] string roleName)
    {
        if (string.IsNullOrWhiteSpace(userEmail))
        {
            return BadRequest("User email is required.");
        }

        var user = await _userManager.FindByEmailAsync(userEmail);
        if (user == null)
        {
            return NotFound("User not found.");
        }

        var currentRoles = await _userManager.GetRolesAsync(user);
        var removalResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
        if (!removalResult.Succeeded)
        {
            return StatusCode(500, "Failed to remove existing roles.");
        }

        // If "None" is selected, just return after removing roles
        if (string.Equals(roleName, "None", StringComparison.OrdinalIgnoreCase))
        {
            return Ok($"Removed all roles from '{userEmail}'.");
        }

        // Only allow Admin or SuperAdmin
        if (roleName != "Admin" && roleName != "SuperAdmin")
        {
            return BadRequest("Invalid role.");
        }

        var roleExists = await _roleManager.RoleExistsAsync(roleName);
        if (!roleExists)
        {
            return NotFound("Role does not exist.");
        }

        var addResult = await _userManager.AddToRoleAsync(user, roleName);
        if (addResult.Succeeded)
        {
            return Ok($"Assigned role '{roleName}' to user '{userEmail}'.");
        }

        return StatusCode(500, "An error occurred while assigning the role.");
    }


    [HttpPut("UpdateRole")]
    public async Task<IActionResult> UpdateRole(string oldRoleName, string newRoleName)
    {
        if (string.IsNullOrWhiteSpace(oldRoleName) || string.IsNullOrWhiteSpace(newRoleName))
        {
            return BadRequest("Both old and new role names are required.");
        }

        var role = await _roleManager.FindByNameAsync(oldRoleName);
        if (role == null)
        {
            return NotFound("Original role does not exist.");
        }

        role.Name = newRoleName;
        var result = await _roleManager.UpdateAsync(role);
        if (result.Succeeded)
        {
            return Ok($"Role renamed from '{oldRoleName}' to '{newRoleName}'.");
        }

        return StatusCode(500, "An error occurred while updating the role.");
    }

    [HttpDelete("DeleteRole")]
    public async Task<IActionResult> DeleteRole(string roleName)
    {
        if (string.IsNullOrWhiteSpace(roleName))
        {
            return BadRequest("Role name is required.");
        }

        var role = await _roleManager.FindByNameAsync(roleName);
        if (role == null)
        {
            return NotFound("Role not found.");
        }

        var result = await _roleManager.DeleteAsync(role);
        if (result.Succeeded)
        {
            return Ok($"Role '{roleName}' deleted successfully.");
        }

        return StatusCode(500, "An error occurred while deleting the role.");
    }

    [HttpPost("RemoveRoleFromUser")]
    public async Task<IActionResult> RemoveRoleFromUser(string userEmail, string roleName)
    {
        if (string.IsNullOrWhiteSpace(userEmail) || string.IsNullOrWhiteSpace(roleName))
        {
            return BadRequest("User email and role name are required.");
        }

        var user = await _userManager.FindByEmailAsync(userEmail);
        if (user == null)
        {
            return NotFound("User not found.");
        }

        var roleExists = await _roleManager.RoleExistsAsync(roleName);
        if (!roleExists)
        {
            return NotFound("Role does not exist.");
        }

        var result = await _userManager.RemoveFromRoleAsync(user, roleName);
        if (result.Succeeded)
        {
            return Ok($"Role '{roleName}' removed from user '{userEmail}'.");
        }

        return StatusCode(500, "An error occurred while removing the role.");
    }

    [HttpGet("GetUsersWithRoles")]
    public async Task<IActionResult> GetUsersWithRoles()
    {
        var users = _userManager.Users.ToList();
        var userRoles = new List<object>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            userRoles.Add(new
            {
                user.Id,
                user.Email,
                Role = roles.FirstOrDefault() ?? "None"
            });
        }
        return Ok(userRoles);
    }
    
    [HttpPut("UpdateUserRole")]
    public async Task<IActionResult> UpdateUserRole([FromBody] UpdateUserRoleRequest request)
    {
        var user = await _userManager.FindByIdAsync(request.UserId);
        if (user == null) return NotFound("User not found");

        var currentRoles = await _userManager.GetRolesAsync(user);
        await _userManager.RemoveFromRolesAsync(user, currentRoles);
        await _userManager.AddToRoleAsync(user, request.NewRole);

        return Ok("Role updated");
    }
    
    public class UpdateUserRoleRequest
    {
        public string UserId { get; set; } = "";
        public string NewRole { get; set; } = "";
    }

    [HttpGet("UserRoles")]
    public async Task<IActionResult> GetUserRoles()
    {
        var roles = _roleManager.Roles
            .Select(r => new { r.Id, r.Name })
            .ToList();

        return Ok(roles);
    }
}
