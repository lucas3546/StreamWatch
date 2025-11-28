using StreamWatch.Application.Common.Models;

namespace StreamWatch.Application.Responses;

public record class GetUserFullStorageOverviewResponse(decimal storageUse, IEnumerable<ExtendedMediaModel> medias);

