using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace StreamWatch.Application.Common.Attributes;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field, AllowMultiple = false)]
public class AllowedExtensionsAttribute : ValidationAttribute
{
    private readonly string[] _extensions;

    public AllowedExtensionsAttribute(params string[] extensions)
    {
        _extensions = extensions.Select(e => e.StartsWith(".") ? e.ToLower() : "." + e.ToLower()).ToArray();
        ErrorMessage = $"Invalid file extension. Allowed: {string.Join(", ", _extensions)}";
    }

    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
        if (value == null) 
            return ValidationResult.Success; // No valida si está vacío

        string fileName = null;

        if (value is IFormFile formFile)
        {
            fileName = formFile.FileName;
        }
        else if (value is string str)
        {
            fileName = str;
        }

        if (!string.IsNullOrEmpty(fileName))
        {
            var extension = Path.GetExtension(fileName).ToLower();
            if (!_extensions.Contains(extension))
            {
                return new ValidationResult(ErrorMessage);
            }
        }

        return ValidationResult.Success;
    }
}
