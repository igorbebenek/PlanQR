using System;
using Microsoft.Extensions.Configuration;
using Novell.Directory.Ldap;

namespace API.Services
{
    public class LdapService
    {
        private readonly IConfiguration _configuration;
        private LdapConnection _ldapConnection;

        public LdapService(IConfiguration configuration)
        {
            _configuration = configuration;
            _ldapConnection = new LdapConnection();
        }

        public (bool isAuthenticated, string givenName, string surname, string title) Authenticate(string username, string password)
        {
            var ldapHost = _configuration["Ldap:Host"];
            var ldapPort = int.Parse(_configuration["Ldap:Port"]);
            var ldapBaseDn = _configuration["Ldap:BaseDn"];
            var bindDn = Environment.GetEnvironmentVariable("LDAP_BIND_DN");
            var bindCredentials = Environment.GetEnvironmentVariable("LDAP_BIND_CREDENTIALS");

            string givenName = string.Empty;
            string surname = string.Empty;
            string title = string.Empty;

            try
            {
                _ldapConnection.Connect(ldapHost, ldapPort);
                _ldapConnection.Bind(bindDn, bindCredentials);

                _ldapConnection.Bind($"uid={username},{ldapBaseDn}", password);

                if (_ldapConnection.Bound)
                {
                    var searchFilter = $"(uid={username})";
                    var searchResults = _ldapConnection.Search(
                        ldapBaseDn,
                        LdapConnection.ScopeSub,
                        searchFilter,
                        new[] { "givenName", "sn", "title" },
                        false
                    );

                    if (searchResults.HasMore())
                    {
                        var entry = searchResults.Next();
                        givenName = entry.GetAttribute("givenName")?.StringValue ?? string.Empty;
                        surname = entry.GetAttribute("sn")?.StringValue ?? string.Empty;
                        title = entry.GetAttribute("title")?.StringValue ?? string.Empty;
                    }

                    return (true, givenName, surname, title);
                }
            }
            catch (LdapException)
            {
                return (false, givenName, surname, title);
            }

            return (false, givenName, surname, title);
        }

        public void CloseConnection()
        {
            if (_ldapConnection != null && _ldapConnection.Connected)
            {
                _ldapConnection.Disconnect();
                _ldapConnection = null;
                Console.WriteLine("LDAP connection closed");
            }
        }
    }
}