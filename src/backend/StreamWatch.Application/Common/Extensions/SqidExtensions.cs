using System;

namespace Sqids;

public static class SqidExtensions
{
    public static bool TrySafeDecode(this SqidsEncoder<int> sqids, string encoded, out long decodedId)
    {
        decodedId = 0;
        var decoded = sqids.Decode(encoded);
        if (decoded is [var id] && encoded == sqids.Encode(id))
        {
            decodedId = id;
            return true;
        }
        return false;
    }
}
