# Solución — Lab 05 (adjuntar disco)

```bash
oc project ex156-lab05
SC=${EX156_SC:-$(oc get sc -o jsonpath='{.items[?(@.metadata.annotations.storageclass\.kubernetes\.io/is-default-class=="true")].metadata.name}')}
```

## PVC en blanco

```bash
cat <<EOF | oc apply -f -
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: storage-vm-data
  namespace: ex156-lab05
spec:
  accessModes: ["ReadWriteOnce"]
  storageClassName: ${SC}
  resources:
    requests:
      storage: 5Gi
EOF
```

## Añadir a la VM

Edita la VM `storage-vm` y agrega disco + volume (hotplug con `virtctl addvolume` si está disponible):

```bash
# Hotplug (si tu build lo soporta):
virtctl addvolume storage-vm --volume-name=datadisk --persist \
  --disk-type=disk --bus=virtio --claim-name=storage-vm-data
```

O patch YAML:

```yaml
# bajo domain.devices.disks:
- name: datadisk
  disk:
    bus: virtio
# bajo volumes:
- name: datadisk
  persistentVolumeClaim:
    claimName: storage-vm-data
```

Reinicia si no usaste hotplug: `virtctl restart storage-vm` / stop+start.

## Dentro del guest

```bash
lsblk
# supone /dev/vdb
sudo mkfs.xfs /dev/vdb
sudo mkdir -p /data
sudo mount /dev/vdb /data
echo attached | sudo tee /data/EX156_OK
# Persistencia:
echo '/dev/vdb /data xfs defaults 0 0' | sudo tee -a /etc/fstab
```

Usa UUID (`blkid`) en fstab cuando puedas.
