# PlanQR

## Wymagany jest .NET w wersji 8.0.0 oraz NodeJS w wersji 22.16.0

### W katalgu API wykonaj
```
dotnet restore
```

### W katalogu client-app wykonaj
```
npm run dev
```

### W katalogu Persistance wykonaj
```
dotnet tool install --global dotnet-ef
```
### Następnie wykonujemy migracje również w folderze Persistance v
```
dotnet database update
```

## W celu uruchomienia aplikacji

### Aby uruchomić serwer backend w katalogu API wykonaj
```
dotnet run
```

### Aby uruchomić serwer frontend w katalogu client-app wykonaj
```
npm run dev
```
