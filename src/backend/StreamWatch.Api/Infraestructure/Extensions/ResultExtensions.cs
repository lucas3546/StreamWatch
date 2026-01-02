using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using StreamWatch.Application.Common.Models;
using StreamWatch.Core.Errors;

namespace StreamWatch.Api.Infraestructure.Extensions;

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

        var problem = new ValidationProblemDetails
        {
            Status = statusCode,
            Title = title,
            Detail = error.Message,
            Type = $"{error.GetType().Name}",
            Instance = httpContext.Request.Path
        };

        if (result.Error?.Key != null)
        {
            problem.Errors[result.Error.Key] =  [result.Error.Message];
        }
        problem.Extensions["traceId"] = httpContext.TraceIdentifier;

        return new ObjectResult(problem)
        {
            StatusCode = statusCode,
        };
    }

    public static ActionResult ToActionResult(this Result result, HttpContext httpContext)
    {
        if (result.IsSuccess)
            return new OkResult();
        
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