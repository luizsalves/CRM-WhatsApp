FROM mcr.microsoft.com/dotnet/sdk:10.0-noble AS build
WORKDIR /src

COPY WhatsCrm.Api/WhatsCrm.Api.csproj WhatsCrm.Api/
RUN dotnet restore WhatsCrm.Api/WhatsCrm.Api.csproj

COPY WhatsCrm.Api/ WhatsCrm.Api/
RUN dotnet publish WhatsCrm.Api/WhatsCrm.Api.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0-noble AS runtime
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "WhatsCrm.Api.dll"]
