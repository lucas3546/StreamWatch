using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace StreamWatch.Application.Common.Attributes;

public class PasswordAttribute : ValidationAttribute
{
    public override bool IsValid(object? value)
    {
        if (value is not string password)
            return false;

        bool hasUppercase = Regex.IsMatch(password, "[A-Z]");
        bool hasNumber = Regex.IsMatch(password, "[0-9]");
        bool hasSpecial = Regex.IsMatch(password, "[\\W_]");

        return hasUppercase && hasNumber && hasSpecial;
    }

    public override string FormatErrorMessage(string name)
    {
        return $"The {name} field must contain at least one capital letter, one number, and one special character.";
    }
}