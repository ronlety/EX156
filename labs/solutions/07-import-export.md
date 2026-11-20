# Solución — Lab 07 (import / export)

## Camino B — Fixture + upload/import (recomendado para labs caseros)

```bash
oc project ex156-lab07
SC=${EX156_SC:-$(oc get sc -o jsonpath='{.items[?(@.metadata.annotations.storageclass\.kubernetes\.io/is-default-class=="true")].metadata.name}')}
DISK_URL=${EX156_DISK_URL:-https://download.cirros-cloud.org/0.6.2/cirros-0.6.2-x86_64-disk.img}
```

Aplica el manifiesto de ejemplo (también en `fixtures/legacy-web/vm.yaml`):

```bash
export SC DISK_URL
envsubst < ../fixtures/legacy-web/vm.yaml | oc apply -f -
virtctl start legacy-web 2>/dev/null || true
oc get vm,vmi,dv legacy-web
```

Si prefieres archivo local:

```bash
virtctl image-upload dv legacy-web-rootdisk \
  --size=10Gi \
  --image-path=../fixtures/legacy-web/disk.qcow2 \
  --storage-class="$SC" \
  --insecure
# Ajusta vm.yaml para usar PVC legacy-web-rootdisk sin http source
```

## Camino A — Export API (resumen)

```bash
# 1) Crear VirtualMachineExport sobre export-src (stopped)
# 2) Obtener enlace/token del export
# 3) Descargar manifests + discos
# 4) En ex156-lab07: recrear DV/PVC + VirtualMachine name: legacy-web
```

Sigue la doc de tu versión: *Exporting and importing virtual machines* en OpenShift Virtualization.

## Verificación

```bash
oc get vm legacy-web -n ex156-lab07
oc get vmi legacy-web -n ex156-lab07
virtctl console legacy-web
```
