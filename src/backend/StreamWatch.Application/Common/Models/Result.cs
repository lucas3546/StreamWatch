using StreamWatch.Core.Errors;

namespace StreamWatch.Application.Common.Models;

public class Result<T>
{
    public T? Data { get; set; }
    public bool IsSuccess { get; set;  }
    public BaseError? Error { get; set; }

    public static Result<T> Success(T data) => new Result<T> { IsSuccess = true, Data = data};
    public static Result<T> Failure(BaseError error) => new Result<T> { IsSuccess = false, Error = error };

}

public class Result
{
    public bool IsSuccess { get; set; }
    public BaseError? Error { get; set; }

    public static Result Success() => new Result{ IsSuccess = true };
    public static Result Failure(BaseError error) => new Result { IsSuccess = false, Error = error };

}