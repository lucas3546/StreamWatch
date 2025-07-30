using Microsoft.AspNetCore.Mvc;
using StreamWatch.Application.Common.Models;
using StreamWatch.Core.Errors;

namespace StreamWatch.Api.Extensions;

public static class ResultExtensions
{
    public static ActionResult<T> ToActionResult<T>(this Result<T> result, HttpContext httpContext)
    {
        if (result.IsSuccess)
            return new OkObjectResult(result.Data);

        var error = result.Error!;
        var (statusCode, title) = error switch
        {
            AccountRegistrationError => (StatusCodes.Status400BadRequest, "AccountRegistrationFailed"),
            NotFoundError => (StatusCodes.Status404NotFound, "NotFound"),
            _ => (StatusCodes.Status400BadRequest, "BadRequest")
        };

        var problem = new ProblemDetails
        {
            Status = statusCode,
            Title = title,
            Detail = error.Message,
            Type = $"{error.GetType().Name}",
            Instance = httpContext.Request.Path
        };

        problem.Extensions["traceId"] = httpContext.TraceIdentifier;

        return new ObjectResult(problem)
        {
            StatusCode = statusCode,
        };
    }
}