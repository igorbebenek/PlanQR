# PlanQR

## Wymagany jest .NET w wersji 8.0.0 oraz NodeJS w wersji 22.16.0

## Instalacja pakietów

### W katalogu `API` wykonaj:
```
dotnet restore
```

### W katalogu `client-app` wykonaj:
```
npm ci
```

### W katalogu `Persistance` wykonaj
```
dotnet tool install --global dotnet-ef
dotnet database update
```
## Konifguracja serwera
a. W katalogu `API` w pliku `appsettings.json` należy uzupełnić puste pola  
b. W katalogu `Api\Properties` w pliku `launchSettings.json` należy uzupełnić "applicationUrl"  
c. W katalogu `client-app` w pliku `.env` należy uzupełnić URL do strony  
d. W katalogu `certs` umieścić pliki:
- cert.pfx
- cert.key
- cert.pem

## Uruchomienie aplikacji

### Aby uruchomić serwer backend w katalogu API wykonaj
```
dotnet run
```

### Aby uruchomić serwer frontend w katalogu client-app wykonaj
```
npm run dev
```
