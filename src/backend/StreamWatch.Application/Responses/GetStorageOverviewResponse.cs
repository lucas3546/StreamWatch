using StreamWatch.Application.Common.Models;

namespace StreamWatch.Application.Responses;

public record GetStorageOverviewResponse(decimal storageUse, IEnumerable<ExtendedMediaModel> medias);
