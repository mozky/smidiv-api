# SMIDIV API

Repositorio que contiene el servidor backend para SMIDIV, consta de varios endpoints
REST, para utilizarlos por la aplicación web, móvil y el dispositivo del automóvil

## Desarrollo

Asegurate de tener una instancia de MongoDB iniciada...

Instala nvm para manejar versiones de nodeJS
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
```

Instalamos Node usando NVM
```
nvm install nove
nvm use node
```

Instala las dependencias
```shell
npm install
```

Para iniciar el servidor con actualizaciones automáticas:
```shell
npm run dev
```

Si quieres modificar la API, abre el editor de Swagger en una nueva terminal:
```shell
swagger project edit
```

## Testing

Para correr los test:
```shell
npm test
```


## Production

NYI
```shell
npm start
```

## Useful links

- [Swagger node guide](https://github.com/swagger-api/swagger-node/blob/master/docs/README.md)
