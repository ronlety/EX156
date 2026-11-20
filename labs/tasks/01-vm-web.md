# Lab 01 — Crear y gestionar VMs (consola web)

**Dominio:** Crear y gestionar máquinas virtuales  
**Tiempo:** ~35 min  
**Proyecto:** `ex156-lab01`

## Objetivos

- Provisionar una VM desde la consola web (catálogo / instancia)
- Arrancar, detener y volver a iniciar
- Acceder por consola VNC/serial desde la UI

## Preparación

```bash
oc new-project ex156-lab01
```

Abre la consola web → perspectiva **Virtualization** (o sección VirtualMachines).

## Tareas

1. Crea el proyecto `ex156-lab01` si la UI lo pide.
2. Crea la VM **`web-catalog`** con:
   - 1 socket / 1 vCPU (o InstanceType pequeño equivalente)
   - 2 Gi RAM
   - Disco del tamaño que ofrezca la plantilla (o ≥ 10 Gi)
   - cloud-init: usuario `student`, contraseña `Ex156Pass!`
3. Asegúrate de que arranque (**Running**).
4. Abre la consola VNC desde la UI y verifica login (o al menos pantalla de boot).
5. Detén la VM desde la UI y confírmala **Stopped**.
6. Vuélvela a iniciar hasta **Running**.

## Criterios de evaluación

```bash
oc project ex156-lab01
oc get vm web-catalog
oc get vmi web-catalog   # presente solo si Running
```

- [ ] Existe `VirtualMachine/web-catalog`
- [ ] Puedes pasar de Stopped → Running sin recrear la VM
- [ ] Consola accesible desde la web

## Pistas (sin spoiler)

- Si el catálogo está vacío, crea desde YAML en la UI o importa una plantilla; el lab 02 cubre CLI puro.
- Revisa eventos en la pestaña Events si el DV no termina.

Solución: [`../solutions/01-vm-web.md`](../solutions/01-vm-web.md)
