# Lab 05 — Adjuntar almacenamiento a una VM

**Dominio:** Gestionar almacenamiento de VMs  
**Tiempo:** ~35 min  
**Proyecto:** `ex156-lab05`

## Objetivos

- Crear PVC/DataVolume adicional
- Adjuntarlo como disco a una VM
- Preparar el filesystem dentro del guest

## Preparación

```bash
oc new-project ex156-lab05
# Crea una VM base running llamada storage-vm (puedes clonar el enfoque del lab 02)
```

Si no tienes VM previa, créala primero (**`storage-vm`**, Running).

## Tareas

1. Crea el PVC o DataVolume **`storage-vm-data`** de **5Gi** (blank disk).
2. Adjunta el volumen a **`storage-vm`** como disco adicional (p. ej. `datadisk` / virtio).
3. Reinicia o usa hotplug si tu versión lo soporta.
4. En el guest:
   - identifica el nuevo disco (`lsblk`)
   - crea partición/filesystem (`xfs` o `ext4`)
   - monta en **`/data`**
   - deja el montaje persistente (`/etc/fstab` o cloud-init mount)
5. Crea un archivo `/data/EX156_OK` con el texto `attached`.

## Criterios de evaluación

```bash
oc get pvc storage-vm-data
oc get vm storage-vm -o yaml | grep -A2 storage-vm-data
# Por consola:
# ls /data/EX156_OK
```

- [ ] PVC Bound
- [ ] Disco referenciado en el spec de la VM
- [ ] `/data/EX156_OK` existe en el guest

Solución: [`../solutions/05-attach-storage.md`](../solutions/05-attach-storage.md)
