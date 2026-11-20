# Labs estilo examen — EX156

Prácticas **hands-on** alineadas al [Red Hat Certified Technologist in OpenShift Virtualization (EX156)](https://www.redhat.com/en/services/training/ex156-red-hat-certified-technologist-in-openshift-virtualization) y al temario de **DO156**.

El examen oficial es práctico (~**2 horas**). Estos labs imitan ese formato: enunciados con nombres fijos, criterios de evaluación y **soluciones aparte**.

## Requisitos del entorno

- Cluster OpenShift **4.14+** (ideal cerca de **4.22** como el examen)
- Operator **OpenShift Virtualization** instalado y `HyperConverged` listo
- CDI / almacenamiento con una `StorageClass` usable (RWO como mínimo; RWX si practicas live migration)
- CLI: `oc`, `virtctl` (y acceso a la consola web)
- Permisos para crear proyectos, VMs, Services, PVC/DataVolumes y (si aplica) redes UDN/NAD

Detalles y variables: [00-environment.md](00-environment.md)

## Cómo practicar

| Modo | Qué hacer |
|------|-----------|
| **Por skill** | Abre un lab en `tasks/` (30–45 min c/u) |
| **Simulacro completo** | Cronometra **120 min** con [exam-brief.md](exam-brief.md); no mires `solutions/` |
| **Autocheck** | Al terminar: `./check/verify-all.sh` (ajusta el proyecto en el script) |

Orden sugerido: `01` → `02` → `03` → `04` → `05` → `06` → `07`.

## Mapa de labs

| Lab | Dominio EX156 | Tiempo |
|-----|---------------|--------|
| [01](tasks/01-vm-web.md) | Crear/gestionar VMs (consola web) | ~35 min |
| [02](tasks/02-vm-cli.md) | Crear/gestionar VMs (CLI) | ~40 min |
| [03](tasks/03-networking.md) | Redes predefinidas / UDN | ~40 min |
| [04](tasks/04-multihomed-lb.md) | Multihoming + LoadBalancer | ~45 min |
| [05](tasks/05-attach-storage.md) | Adjuntar almacenamiento | ~35 min |
| [06](tasks/06-snapshots-clones.md) | Snapshots y clones | ~40 min |
| [07](tasks/07-import-export.md) | Importar VMs exportadas | ~40 min |

Soluciones: carpeta [`solutions/`](solutions/).

## Reglas de estilo examen

1. Usa **exactamente** los nombres de recursos del enunciado.
2. La configuración debe **persistir** (CRs aplicados; no arreglos temporales en el bastion).
3. Documentación del producto = OK; no copies soluciones.
4. Si tu cluster no tiene UDN/LB/export API, lee las **variantes** al final de cada task.

## Aviso

Material no oficial. Las URLs de imágenes, nombres de StorageClass y APIs de red pueden variar según versión; adapta según [00-environment.md](00-environment.md).
