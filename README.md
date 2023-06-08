# Confirmador de Lectura de Correos Electrónicos

Este proyecto es un confirmador de lectura de correos electrónicos. Permite verificar si un correo electrónico ha sido leído por el destinatario insertandole una imagen atraves de una URL q.

## Características

- Responde con una imagen seleccionada independientemente de la ruta a la que se acceda, lo que permite rastrear la apertura de correos electrónicos.
- Permite ver y guardar las peticiones y errores en un archivo que se genera llamado "log.txt" a través de una peticion GET solo con cabeceras específicas desde cualquier client HTTP.
- Proporciona una imagen predeterminada en caso de que no se encuentre una imagen local o externa.

## Requisitos previos

- `Node.js` instalado
- `npm` o `pnpm` (Gestor de paquetes de Node.js) instalado

## Instalación

1. Clona este repositorio en tu máquina local:

```sh
git clone https://github.com/RomanFama592/email-read-confirmation-nodejs
```


2. Navega hasta el directorio del proyecto:

```sh
cd email-read-confirmation-nodejs
```

3. Instala las dependencias del proyecto:

```sh
npm install
```

## Uso

1. Configura las variables de entorno:

   - Crea un archivo `.env` en la raíz del proyecto.
   - Define las variables de entorno necesarias en el archivo `.env`, usa el archivo `.env.example` para guiarte.

2. Inicia el servidor:

```sh
npm start
```

_`PD: para poder usarlo para correo electronicos tendrias que usar una pagina de hosting o abrir puertos en tu router para desplegar el proyecto.`_

3. Ya puedes insertar la url con el identificador:

    Un ejemplo de uso seria este:


>http://tu-dominio.com/test
>
>http://tu-dominio.com/test2


_Asi se verian las salidas por consola y las peticiones a las rutas_


4. Rutas especiales:

_Todas estas las rutas se comportaran como otra ruta generica si es que no tienes en las cabeceras de la peticion la cabecera "authdata" y que sea valido._

>- `/viewlog`
>
>_Te permite ver los logs como lo muestra la imagen de abajo._
>
>![img](https://github.com/RomanFama592/email-read-confirmation-nodejs/blob/master/docs/log-example.png?raw=true)
>
>- `/clearlog`
>
>_Si existen logs los elimina._

<br>

## Contribución

Si deseas contribuir a este proyecto y mejorar su funcionalidad, sigue los pasos a continuación:

1. Haz un fork de este repositorio.
2. Crea una rama con tu nueva funcionalidad: `git checkout -b feature/nueva-funcionalidad`.
3. Realiza los cambios y realiza commits: `git commit -m 'Agrega nueva funcionalidad'`.
4. Haz push a la rama: `git push origin feature/nueva-funcionalidad`.
5. Crea una pull request en este repositorio.

<br>
<br>
<p align="right"><a href="#top">Back to top 🔼</a></p>