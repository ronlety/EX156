# Solución — Lab 06 (snapshots / clones)

```bash
oc project ex156-lab06
```

## Snapshot

```bash
cat <<'EOF' | oc apply -f -
apiVersion: snapshot.kubevirt.io/v1beta1
kind: VirtualMachineSnapshot
metadata:
  name: snap-src-snap1
  namespace: ex156-lab06
spec:
  source:
    apiGroup: kubevirt.io
    kind: VirtualMachine
    name: snap-src
EOF

oc get vmsnapshot snap-src-snap1 -w
```

> Grupo/versión puede ser `snapshot.kubevirt.io/v1alpha1` en builds antiguos. Detén la VM antes si la doc lo indica.

## Restore → nueva VM

```bash
cat <<'EOF' | oc apply -f -
apiVersion: snapshot.kubevirt.io/v1beta1
kind: VirtualMachineRestore
metadata:
  name: snap-clone-restore
  namespace: ex156-lab06
spec:
  target:
    apiGroup: kubevirt.io
    kind: VirtualMachine
    name: snap-clone
  virtualMachineSnapshotName: snap-src-snap1
EOF
```

Luego `virtctl start snap-clone` si no arranca sola.

## VirtualMachineClone (si existe el CRD)

```bash
oc api-resources | grep -i virtualmachineclone
# Ejemplo conceptual:
# spec.source.name: snap-src
# spec.target.name: snap-clone
```

## Alternativa CDI clone

```bash
SRC_PVC=$(oc get vm snap-src -o jsonpath='{.spec.template.spec.volumes[0].persistentVolumeClaim.claimName}')
# o el DV/PVC real de rootdisk
SC=${EX156_SC}

cat <<EOF | oc apply -f -
apiVersion: cdi.kubevirt.io/v1beta1
kind: DataVolume
metadata:
  name: snap-clone-rootdisk
  namespace: ex156-lab06
spec:
  source:
    pvc:
      namespace: ex156-lab06
      name: ${SRC_PVC}
  storage:
    storageClassName: ${SC}
    resources:
      requests:
        storage: 15Gi
EOF
```

Crea `VirtualMachine/snap-clone` apuntando a `snap-clone-rootdisk` (mismo patrón que lab 02).
