# Simulacro EX156 — Brief completo (120 minutos)

**No abras `solutions/` hasta terminar o agotar el tiempo.**

## Escenario

Eres administrador de virtualización en un cluster OpenShift con OpenShift Virtualization ya desplegado. Debes dejar operativas varias máquinas virtuales con red y almacenamiento según los requisitos de la aplicación *shop*.

## Datos generales

| Ítem | Valor |
|------|-------|
| Proyecto | `ex156-exam` (créalo si no existe) |
| StorageClass | la default del cluster (o la indicada por tu instructor) |
| Tiempo | **120 minutos** |
| Documentación del producto | permitida |

Prepara el proyecto:

```bash
oc new-project ex156-exam
```

---

## Tarea A — VM desde plantilla / catálogo (web o CLI) — 15 pts

1. Crea la VM **`shop-frontend`** en `ex156-exam`.
2. Recursos mínimos: **1 vCPU**, **2 Gi** de memoria, disco root **20 Gi** (o el tamaño mínimo que permita tu imagen de lab).
3. Debe arrancar y quedar en estado **Running**.
4. Configura cloud-init (u otro método) para el usuario **`student`** con contraseña **`Ex156Pass!`** (o tu clave SSH).
5. Demuestra acceso a consola serial o VNC (`virtctl console` / `virtctl vnc` o consola web).

**Evaluación:** `oc get vm shop-frontend` Running; existe VMI; consola accesible.

---

## Tarea B — VM solo por CLI — 15 pts

1. Crea **`shop-db`** únicamente con manifiestos/`oc`/`virtctl` (sin asistente web).
2. Disco root desde imagen HTTP o upload (DataVolume / `virtctl image-upload`), PVC **≥ 15 Gi**.
3. `runStrategy` o equivalente para que quede **Running**.
4. Etiqueta la VM con `app=shop` y `tier=db`.

**Evaluación:** recurso `VirtualMachine/shop-db` Running; labels presentes; PVC/DV asociados Bound/Succeeded.

---

## Tarea C — Red definida + VM en esa red — 20 pts

1. Crea (o usa) una red de usuario llamada **`shop-udn`** (UDN, NAD/Multus u opción equivalente documentada en tu cluster).
2. Crea la VM **`shop-cache`** conectada a esa red (además o en lugar de solo explicar la pod network, según lo que pida tu variante de entorno).
3. La VM debe obtener conectividad L2/L3 coherente con esa red (verifica con `ip a` / ping según diseño).

**Evaluación:** red `shop-udn` existe; VM referencia esa red en `spec.template.spec.networks`; VMI Running.

*Variante sin UDN:* NetworkAttachmentDefinition `shop-udn` + interfaz `bridge`/`sriov` según lab.

---

## Tarea D — Multihoming y LoadBalancer — 20 pts

1. Modifica **`shop-frontend`** para que sea **multihomed**:
   - interfaz en la **pod network** (masquerade), y
   - segunda interfaz en **`shop-udn`** (o NAD equivalente).
2. Dentro del guest (o vía cloud-init), el servicio HTTP debe escuchar en el puerto **8080** (puedes usar un `python3 -m http.server 8080`, nginx, o busybox `httpd` según la imagen).
3. Crea el Service **`shop-frontend-lb`** de tipo **LoadBalancer** (o NodePort si no hay LB) que envíe tráfico externo al puerto **8080** de la VM.
4. Selector debe apuntar correctamente a la VMI/pod de `shop-frontend`.

**Evaluación:** dos interfaces en el spec; Service existe; hay Endpoints; curl a EXTERNAL-IP/NodePort responde.

---

## Tarea E — Disco adicional — 10 pts

1. Crea un PVC o DataVolume **`shop-frontend-data`** de **5 Gi**.
2. Adjunta ese disco a **`shop-frontend`** como disco virtio adicional.
3. En el guest, formatea y monta el disco en **`/data`** (persistente tras reboot del guest si es posible con fstab/cloud-init).

**Evaluación:** PVC Bound; disco visible en el spec de la VM; montaje `/data` verificable por consola.

---

## Tarea F — Snapshot y clone — 10 pts

1. Crea un snapshot **`shop-frontend-snap1`** de `shop-frontend` (apagada o según best practice de tu versión).
2. Clona o restaura generando la VM **`shop-frontend-clone`** a partir del snapshot (o clone de DV/PVC si snapshots CSI no están disponibles — documenta cuál usaste).
3. `shop-frontend-clone` debe poder iniciar (Running).

**Evaluación:** existen snapshot (o evidencia de clone) y VM clone Running.

---

## Tarea G — Importar VM exportada — 10 pts

1. En el directorio [`fixtures/`](fixtures/) (o el export que generes tú) hay material de una VM exportada de práctica llamado **`legacy-web`**.
2. Impórtala al proyecto `ex156-exam` como VM **`legacy-web`**.
3. Arráncala y verifica Running.

Si no tienes API de export/import: importa el disco con CDI/`virtctl image-upload` y crea el CR `VirtualMachine` con el nombre pedido.

**Evaluación:** `VirtualMachine/legacy-web` Running en `ex156-exam`.

---

## Autoevaluación rápida

```bash
cd labs/check
./verify-all.sh ex156-exam
```

## Entrega (práctica)

Lista lo que dejaste Running:

```bash
oc get vm,vmi,dv,pvc,svc,net-attach-def 2>/dev/null
oc get userdefinednetwork,clusteruserdefinednetwork 2>/dev/null
oc get vmsnapshot,vmrestore,vmclone 2>/dev/null
```
