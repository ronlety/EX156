# Lab 04 — Multihoming y acceso externo (LoadBalancer)

**Dominio:** Configurar redes de máquinas virtuales  
**Tiempo:** ~45 min  
**Proyecto:** `ex156-lab04`

## Objetivos

- Configurar una VM con **dos** interfaces (multihomed)
- Exponer un servicio HTTP con Service tipo **LoadBalancer**

## Preparación

```bash
oc new-project ex156-lab04
# Reutiliza lab-udn del lab 03 o créala de nuevo en este proyecto / cluster scope
```

Necesitas MetalLB, LB de cloud, o aceptar la variante **NodePort**.

## Tareas

1. Crea (o importa) la VM **`app-vm`** Running con guest capaz de servir HTTP (Fedora/RHEL/CentOS cloud recomendado; con Cirros limita el alcance).
2. Configura **multihoming**:
   - NIC1: pod network (`masquerade`)
   - NIC2: red `lab-udn` (o NAD `lab-udn`)
3. En el guest, levanta un listener en el puerto **8080** (servicio de prueba).
4. Crea el Service **`app-vm-lb`**:
   - `type: LoadBalancer` (o NodePort)
   - puerto **80** → **targetPort 8080**
   - selector hacia la VMI de `app-vm` (p. ej. label `kubevirt.io/domain=app-vm`)
5. Demuestra acceso externo: `curl` a EXTERNAL-IP o a `nodeip:nodePort`.

## Criterios de evaluación

```bash
oc get vm app-vm -o jsonpath='{range .spec.template.spec.domain.devices.interfaces[*]}{.name}{" "}{.masquerade}{.bridge}{"\n"}{end}'
oc get svc app-vm-lb -o wide
oc get endpoints app-vm-lb
```

- [ ] Dos interfaces declaradas en la VM
- [ ] Service `app-vm-lb` existe y tiene Endpoints
- [ ] HTTP responde desde fuera del guest

## Variante NodePort

Si `EXTERNAL-IP` queda `<pending>`, cambia a NodePort y documenta `NODE_IP:NODEPORT`.

Solución: [`../solutions/04-multihomed-lb.md`](../solutions/04-multihomed-lb.md)
