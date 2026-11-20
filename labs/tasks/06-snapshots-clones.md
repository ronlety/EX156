# Lab 06 — Snapshots y clones

**Dominio:** Gestionar almacenamiento de VMs  
**Tiempo:** ~40 min  
**Proyecto:** `ex156-lab06`

## Objetivos

- Crear un snapshot de VM
- Restaurar o clonar a una nueva VM
- (Alternativa) clonar discos con DataVolume si no hay CSI snapshots

## Preparación

```bash
oc new-project ex156-lab06
# VM origen: snap-src  (Running al menos una vez; para snapshot suele recomendarse stopped)
```

Crea **`snap-src`** con un disco PVC (lab 02). Opcional: escribe un marcador en el guest (`echo marker > /home/student/MARKER` o equivalente).

## Tareas

1. Detén `snap-src` si tu procedimiento de snapshot lo requiere.
2. Crea **`VirtualMachineSnapshot`** llamado **`snap-src-snap1`**.
3. Espera a que el snapshot quede listo (`Ready` / Succeeded según API).
4. Genera la VM **`snap-clone`** desde ese snapshot (`VirtualMachineRestore` o `VirtualMachineClone`, según versión).
5. Inicia `snap-clone` y verifica Running.
6. Si el marcador existía, confírmalo en el clone.

### Alternativa sin VolumeSnapshot CSI

1. Clona el PVC/DV de `snap-src` a un nuevo DV `snap-clone-rootdisk` (`spec.source.pvc`).
2. Crea VM `snap-clone` apuntando a ese DV.
3. Documenta en un comentario/archivo local que usaste clone CDI.

## Criterios de evaluación

```bash
oc get vmsnapshot,vmrestore,vmclone 2>/dev/null
oc get vm snap-src snap-clone
oc get vmi snap-clone
```

- [ ] Snapshot (o DV clone) existe y está completo
- [ ] `snap-clone` Running
- [ ] `snap-src` sigue existiendo (no la borres)

Solución: [`../solutions/06-snapshots-clones.md`](../solutions/06-snapshots-clones.md)
