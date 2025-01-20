using System;
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

    public (bool isAuthenticated, string givenName, string surname) Authenticate(string username, string password)
    {
        var ldapHost = _configuration["Ldap:Host"];
        var ldapPort = int.Parse(_configuration["Ldap:Port"]);
        var ldapBaseDn = _configuration["Ldap:BaseDn"];
        var bindDn = Environment.GetEnvironmentVariable("LDAP_BIND_DN");
        var bindCredentials = Environment.GetEnvironmentVariable("LDAP_BIND_CREDENTIALS");

        string givenName = string.Empty;
        string surname = string.Empty;

        try
        {
            using (var ldapConnection = new LdapConnection())
            {
                ldapConnection.Connect(ldapHost, ldapPort);
                ldapConnection.Bind(bindDn, bindCredentials);

                ldapConnection.Bind($"uid={username},{ldapBaseDn}", password);

                if (ldapConnection.Bound)
                {
                    var searchFilter = $"(uid={username})";
                    var searchResults = ldapConnection.Search(
                    ldapBaseDn,
                    LdapConnection.ScopeSub,
                    searchFilter,
                    new[] { "givenName", "sn" },
                    false
                );

                if (searchResults.HasMore())
                {
                    var entry = searchResults.Next();
                    givenName = entry.GetAttribute("givenName")?.StringValue ?? string.Empty;
                    surname = entry.GetAttribute("sn")?.StringValue ?? string.Empty;
                }

                    return (true, givenName, surname);
                }
            }
        }
        catch (LdapException)
        {
            return (false, givenName, surname);
        }

        return (false, givenName, surname);
    }
}
}