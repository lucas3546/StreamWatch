using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.Extensions.Configuration;

namespace StreamWatch.Application.Common.Attributes;

public class MaxUsagePerUserAttribute : ValidationAttribute
{
    private const string ConfigKey = "Storage:LimitUsagePerUser";

    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
        if (value == null)
            return ValidationResult.Success;

        var configuration = (IConfiguration)validationContext.GetService(typeof(IConfiguration));

        if (configuration == null)
            return new ValidationResult("Configuration not available");

        var max = long.Parse(configuration[ConfigKey]!);


        if (value is long intValue && intValue > max) return new ValidationResult($"The value cannot be greater than {max}");
            

        return ValidationResult.Success;
    }
}