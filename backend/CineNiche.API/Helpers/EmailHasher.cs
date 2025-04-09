// /Helpers/HashingHelper.cs
using System.Security.Cryptography;
using System.Text;

namespace CineNiche.API.Helpers
{
    public static class EmailHasher
    {
        public static string GetStableHash(string input)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(input));

                // Take the first 4 bytes (32 bits) and convert them into an int
                int numericHash = BitConverter.ToInt32(hashBytes, 0); 

                return numericHash.ToString(); // Return the hash as a string that can be parsed as an int
            }
        }
    }
}
