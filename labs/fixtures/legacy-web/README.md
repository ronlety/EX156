# Fixture `legacy-web`

Simula una VM “exportada” para el lab 07 / tarea G del simulacro.

| Archivo | Uso |
|---------|-----|
| `vm.yaml` | Plantilla de `VirtualMachine` (sustituye `STORAGE_CLASS` y `DISK_URL`) |
| `disk.qcow2` | Opcional: coloca aquí un disco pequeño para `virtctl image-upload` |

Este directorio **no** incluye un `.qcow2` binario (peso). Usa `EX156_DISK_URL` o genera uno:

```bash
# Ejemplo: descargar Cirros como "disco exportado"
curl -L -o disk.img \
  https://download.cirros-cloud.org/0.6.2/cirros-0.6.2-x86_64-disk.img
```
