FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

RUN apt-get update \
 && apt-get install -y --no-install-recommends \
    libvips \
    ffmpeg \
 && rm -rf /var/lib/apt/lists/*


FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["src/backend/StreamWatch.Api/StreamWatch.Api.csproj", "src/backend/StreamWatch.Api/"]
RUN dotnet restore "src/backend/StreamWatch.Api/StreamWatch.Api.csproj"
COPY . .
WORKDIR "/src/src/backend/StreamWatch.Api"
RUN dotnet build "./StreamWatch.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build


FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./StreamWatch.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "StreamWatch.Api.dll"]
