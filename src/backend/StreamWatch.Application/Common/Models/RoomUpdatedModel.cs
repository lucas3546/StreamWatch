using System.Text.Json.Serialization;
using StreamWatch.Core.Enums;

namespace StreamWatch.Application.Common.Models;

public record class RoomUpdatedModel(
    string Title,
    string Category,
    bool IsPublic
);