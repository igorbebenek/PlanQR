using Microsoft.Extensions.Configuration;
using Novell.Directory.Ldap;

namespace API.Services
{
    public class LdapService
    {
        private readonly IConfiguration _configuration;

        public LdapService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public bool Authenticate(string username, string password)
        {
            var ldapHost = _configuration["Ldap:Host"];
            var ldapPort = int.Parse(_configuration["Ldap:Port"]);
            var ldapBaseDn = _configuration["Ldap:BaseDn"];
            var bindDn = Environment.GetEnvironmentVariable("LDAP_BIND_DN");
            var bindCredentials = Environment.GetEnvironmentVariable("LDAP_BIND_CREDENTIALS");

            try
            {
                using (var ldapConnection = new LdapConnection())
                {
                    ldapConnection.Connect(ldapHost, ldapPort);
                    ldapConnection.Bind(bindDn, bindCredentials);

                    ldapConnection.Bind($"uid={username},{ldapBaseDn}", password);

                    return ldapConnection.Bound;
                }
            }
            catch (LdapException)
            {
                return false;
            }
        }
    }
}