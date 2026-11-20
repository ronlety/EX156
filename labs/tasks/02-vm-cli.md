# Lab 02 — Crear y gestionar VMs (CLI)

**Dominio:** Crear y gestionar máquinas virtuales  
**Tiempo:** ~40 min  
**Proyecto:** `ex156-lab02`

## Objetivos

- Crear una VM con `oc apply` y/o `virtctl`
- Poblar disco con DataVolume o `virtctl image-upload`
- Usar `virtctl start|stop|console`

## Preparación

```bash
source ../00-environment.md 2>/dev/null || true
oc new-project ex156-lab02
# export EX156_SC=... EX156_DISK_URL=...  (ver 00-environment.md)
```

## Tareas

1. Crea la VM **`cli-vm`** **solo por CLI**.
2. Disco root vía CDI:
   - DataVolume **`cli-vm-rootdisk`** (o `dataVolumeTemplates` en la VM)
   - tamaño **15Gi**
   - fuente: URL en `EX156_DISK_URL` **o** upload local con `virtctl image-upload`
3. Recursos: **1 vCPU**, **1 Gi** RAM (o el mínimo estable para tu imagen).
4. cloud-init con usuario `student` / `Ex156Pass!` (si la imagen lo soporta; Cirros puede omitirse).
5. Inicia con `virtctl start cli-vm` (o `runStrategy: Always`).
6. Conéctate con `virtctl console cli-vm` y sal con `Ctrl+]`.
7. Detén con `virtctl stop cli-vm` y vuelve a iniciar.

## Criterios de evaluación

```bash
oc get vm cli-vm -o yaml | grep -E 'runStrategy|running:'
oc get dv,pvc
virtctl guestosinfo cli-vm 2>/dev/null || true
```

- [ ] `VirtualMachine/cli-vm` llega a Running
- [ ] DV/PVC en Succeeded/Bound
- [ ] Consola serial funciona
- [ ] Stop/start no requiere recrear el CR

## Restricción estilo examen

No uses el asistente gráfico para crear esta VM.

Solución: [`../solutions/02-vm-cli.md`](../solutions/02-vm-cli.md)
