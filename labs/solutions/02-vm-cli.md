# Solución — Lab 02 (CLI)

Ajusta `STORAGE_CLASS` y `DISK_URL`.

```bash
oc project ex156-lab02
STORAGE_CLASS=${EX156_SC:-$(oc get sc -o jsonpath='{.items[?(@.metadata.annotations.storageclass\.kubernetes\.io/is-default-class=="true")].metadata.name}')}
DISK_URL=${EX156_DISK_URL:-https://download.cirros-cloud.org/0.6.2/cirros-0.6.2-x86_64-disk.img}
```

## Manifiesto

```bash
cat <<EOF | oc apply -f -
apiVersion: kubevirt.io/v1
kind: VirtualMachine
metadata:
  name: cli-vm
  namespace: ex156-lab02
spec:
  running: true
  template:
    metadata:
      labels:
        kubevirt.io/domain: cli-vm
    spec:
      domain:
        cpu:
          cores: 1
        resources:
          requests:
            memory: 1Gi
        devices:
          disks:
            - name: rootdisk
              disk:
                bus: virtio
            - name: cloudinitdisk
              disk:
                bus: virtio
          interfaces:
            - name: default
              masquerade: {}
        machine:
          type: q35
      networks:
        - name: default
          pod: {}
      volumes:
        - name: rootdisk
          dataVolume:
            name: cli-vm-rootdisk
        - name: cloudinitdisk
          cloudInitNoCloud:
            userData: |
              #cloud-config
              user: student
              password: Ex156Pass!
              chpasswd: { expire: False }
              ssh_pwauth: True
  dataVolumeTemplates:
    - metadata:
        name: cli-vm-rootdisk
      spec:
        source:
          http:
            url: ${DISK_URL}
        storage:
          storageClassName: ${STORAGE_CLASS}
          resources:
            requests:
              storage: 15Gi
EOF
```

> Si tu API prefiere `runStrategy: Always` en lugar de `running: true`, cámbialo.
> Cirros a menudo ignora cloud-init; usa login Cirros o una imagen cloud con cloud-init.

## virtctl

```bash
virtctl stop cli-vm
virtctl start cli-vm
virtctl console cli-vm
# Ctrl+]
```

## Upload local (alternativa a HTTP)

```bash
virtctl image-upload dv cli-vm-rootdisk \
  --size=15Gi \
  --image-path=/path/to/disk.qcow2 \
  --storage-class="$STORAGE_CLASS" \
  --insecure
# Luego VM sin dataVolumeTemplates, volume PVC name: cli-vm-rootdisk
```
