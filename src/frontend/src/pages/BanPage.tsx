import { useEffect, useState } from "react";
import {
  getCurrentBan,
  type GetActiveBanForCurrentUserResponse,
} from "../services/banService";

export default function BanPage() {
  const [ban, setBan] = useState<GetActiveBanForCurrentUserResponse | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getCurrentBan();
        setBan(data);
      } catch (err: any) {
        if (err.response?.data?.detail) {
          setError(err.response.data.detail);
        } else {
          setError("Unexpected error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-950 text-white px-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-lg p-8 w-full max-w-md transition-all duration-300 hover:shadow-xl">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="text-4xl mb-1">🚫</div>
          <h1 className="text-2xl font-semibold text-white">
            You have been banned
          </h1>

          {isLoading && (
            <p className="text-gray-400 text-sm animate-pulse">
              Loading ban details...
            </p>
          )}

          {!isLoading && error && (
            <div className="w-full border border-red-800 bg-red-950/40 text-red-400 rounded-lg p-3 text-sm font-medium">
              {error}
            </div>
          )}

          {!isLoading && !error && ban && (
            <div className="w-full mt-2 bg-neutral-950/50 border border-neutral-800 rounded-lg p-5 text-sm text-gray-300 text-left space-y-2">
              <p>
                <span className="text-gray-400 font-medium">Ban ID:</span>{" "}
                <span className="text-gray-200">{ban.id}</span>
              </p>
              <p>
                <span className="text-gray-400 font-medium">Reason:</span>{" "}
                <span className="text-gray-200">{ban.reason}</span>
              </p>
              <p>
                <span className="text-gray-400 font-medium">Expires at:</span>{" "}
                <span className="text-gray-200">{ban.expiresAt}</span>
              </p>
            </div>
          )}

          {!isLoading && (
            <p>
              You can appeal your ban by sending an email to
              support@streamwatch.com with the subject "Ban Appeal" and your ban
              ID in the body of the message.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
