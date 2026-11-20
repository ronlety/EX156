# Lab 03 — Redes de VM (predefinidas / UDN)

**Dominio:** Configurar redes de máquinas virtuales  
**Tiempo:** ~40 min  
**Proyecto:** `ex156-lab03`

## Objetivos

- Conectar una VM a la red por defecto (pod network)
- Crear/usar una red definida por el usuario (`lab-udn`)
- Arrancar una VM unida a esa red

## Preparación

```bash
oc new-project ex156-lab03
```

Confirma si tu cluster soporta **UserDefinedNetwork** / **ClusterUserDefinedNetwork**. Si no, usa la variante NAD al final.

## Tareas

1. Crea la VM **`net-default`** con una sola interfaz **masquerade** en la pod network. Déjala **Running**.
2. Crea la red de usuario **`lab-udn`** (nombre exacto del recurso/NAD según API disponible).
3. Crea la VM **`net-udn`** cuya interfaz primaria (o secundaria, según diseño UDN de tu versión) use **`lab-udn`**.
4. Verifica desde la consola del guest que hay dirección/enlace en la NIC esperada (`ip a`, `nmcli`, etc.).

## Criterios de evaluación

```bash
oc get vm net-default net-udn
oc get userdefinednetwork,clusteruserdefinednetwork,net-attach-def 2>/dev/null
oc get vm net-udn -o jsonpath='{.spec.template.spec.networks}' ; echo
```

- [ ] `net-default` Running en pod network
- [ ] Existe red `lab-udn` (UDN o NAD)
- [ ] `net-udn` referencia esa red y está Running

## Variante sin UDN

Crea `NetworkAttachmentDefinition` llamada **`lab-udn`** (bridge o macvlan según nodos) y referencia `multus` en `spec.template.spec.networks`.

Solución: [`../solutions/03-networking.md`](../solutions/03-networking.md)
