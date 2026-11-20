# Solución — Lab 03 (redes)

## VM en pod network

Reutiliza el patrón del lab 02 con nombre `net-default` e interfaz masquerade/pod (ya incluido en ese YAML).

## Opción A — UserDefinedNetwork (OVN, versiones recientes)

El API exacto varía; ejemplo ilustrativo (verifica CRDs en tu cluster):

```bash
oc api-resources | grep -i userdefined
```

Ejemplo de `UserDefinedNetwork` en el namespace (ajusta `cidr`/topology a tu docs):

```yaml
apiVersion: k8s.ovn.org/v1
kind: UserDefinedNetwork
metadata:
  name: lab-udn
  namespace: ex156-lab03
spec:
  topology: Layer2
  layer2:
    role: Primary
    subnets:
      - 203.0.113.0/24
```

Luego referencia la UDN en la VM según la documentación de tu versión (a menudo como red primaria del namespace o vía network name en el spec).

## Opción B — NetworkAttachmentDefinition (Multus) — muy común en labs

```bash
cat <<'EOF' | oc apply -f -
apiVersion: k8s.cni.cncf.io/v1
kind: NetworkAttachmentDefinition
metadata:
  name: lab-udn
  namespace: ex156-lab03
spec:
  config: |
    {
      "cniVersion": "0.3.1",
      "name": "lab-udn",
      "type": "bridge",
      "bridge": "br-lab",
      "ipam": {}
    }
EOF
```

> El `bridge` debe existir en los nodos o usa el CNI/bridge que tu lab documente (a veces `macvlan`/`ovn-k8s-cni-overlay`).

Fragmento de VM `net-udn` (multihoming simple: pod + NAD):

```yaml
domain:
  devices:
    interfaces:
      - name: default
        masquerade: {}
      - name: udn
        bridge: {}
networks:
  - name: default
    pod: {}
  - name: udn
    multus:
      networkName: lab-udn
```

Arranca y en el guest revisa la segunda NIC.

## Verificación

```bash
oc get net-attach-def lab-udn -n ex156-lab03
oc get vm net-udn -o yaml | sed -n '/networks:/,/volumes:/p'
```
