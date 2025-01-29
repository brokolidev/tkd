using Microsoft.AspNetCore.Identity;

namespace taekwondo_backend.Models.Identity
{
    public class Role : IdentityRole<int>
    {

        public Role()
        {
        }

        public Role(string roleName) : base(roleName)
        {
        }
    }
}