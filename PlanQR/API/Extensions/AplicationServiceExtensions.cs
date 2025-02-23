using Application.Core;
using Application.Messages;
using API.Services; // Add this line
using Infrastructure.Data;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAllOrigins", policy =>
                {
                    policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                });
            });
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Get.Handler).Assembly));
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);
            services.AddScoped<LdapService>(); // Add this line
            services.AddScoped<MessageRepository>();
            
            return services;
        }
    }
}