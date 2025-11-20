using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StreamWatch.Core.Enums;

namespace StreamWatch.Application.Common.Models
{
    public record RoomCreatedNotificationModel(string roomId, string thumbnailUrl, string title, string category, string provider, int userCount, DateTime createdAt);

}