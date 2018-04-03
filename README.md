# GDGAIYVoiceKit
Repositorio con las DEMOS realizadas en el meetup del GDG Ourense https://www.meetup.com/es-ES/gdgourense/events/249031594/

*IMPORTANTE:* Debes usar la última versión de la Raspbian preparada por AIY Project, en la cul no es necesario activar ningún entorno virtual.... te recomendamos que uses la imagen oficial que puedes descargar aquí https://dl.google.com/dl/aiyprojects/aiyprojects-latest.img.xza

Si tienes algún problema, ejecuta el siguiente comando:

```bash
./scripts/install-deps.sh
```

# DEMOS

Para las demos simplemete es ejecutar el fichero python. Sólo mención especial a dos:

## 03-Stranger-things-wall

La pared de Stranger Things con las luces, las puedes ver en https://cherry-crisp-54477.herokuapp.com

Si quieres crear tu propio servidor puedes descargar el código del repo https://github.com/monchopena/stranger-things-wall-socket

Mención especial y agradecimientos a Nestor Plasencia, ya que para este ejemplo hemos usado sus gráficos y también nos basamos en su código: https://www.youtube.com/watch?v=5-PoFOjg4wE

## 06-dialog-flow

Para esta demo hemos usado directamente el inline editor que nos proporciona dialogFlow y que carga el código en una firebase cloud function. Simplemente copia y pega en él el código del ejemplo.

# Config things on Raspbian

```bash
sudo raspi-config
```
