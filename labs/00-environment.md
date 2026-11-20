# Entorno de laboratorio

Antes de los labs, fija estas variables (ajústalas a tu cluster).

```bash
export EX156_PROJECT=ex156-lab
export EX156_SC=$(oc get sc -o jsonpath='{.items[?(@.metadata.annotations.storageclass\.kubernetes\.io/is-default-class=="true")].metadata.name}')
# Si no hay default:
# export EX156_SC=ocs-storagecluster-ceph-rbd

# Imagen cloud de práctica (sustituye por la que permita tu lab / registry)
export EX156_DISK_URL="https://download.cirros-cloud.org/0.6.2/cirros-0.6.2-x86_64-disk.img"
# Alternativa Fedora Cloud (más realista, más pesada):
# export EX156_DISK_URL="https://download.fedoraproject.org/pub/fedora/linux/releases/40/Cloud/x86_64/images/Fedora-Cloud-Base-Generic.x86_64-40-1.14.qcow2"

export EX156_SSH_PUBKEY="$HOME/.ssh/id_rsa.pub"   # opcional para cloud-init
```

## Checklist de salud

```bash
oc whoami
oc get hyperconverged -n openshift-cnv
oc get csv -n openshift-cnv
oc get storageclass
virtctl version
```

Esperado: HyperConverged en estado saludable, StorageClass disponible, `virtctl` alineado con el cluster.

## Proyecto de trabajo

```bash
oc new-project "$EX156_PROJECT"
# o: oc project "$EX156_PROJECT"
```

En el **simulacro completo** ([exam-brief.md](exam-brief.md)) el proyecto se llama exactamente `ex156-exam`.

## Capacidades opcionales

| Capacidad | Labs | Si no está disponible |
|-----------|------|------------------------|
| User-Defined Networks (UDN) / OVN | 03, 04, exam | Usa NAD/Multus bridge o la variante del enunciado |
| Service `LoadBalancer` (cloud o MetalLB) | 04, exam | Usa `NodePort` y documenta la IP del nodo |
| VolumeSnapshots (CSI) | 06, exam | Usa clone de DataVolume como alternativa de práctica |
| VM export/import API | 07, exam | Exporta YAML + disco vía `virtctl image-upload` / DV |

## Credenciales guest (cuando uses cloud-init de los labs)

Salvo que el enunciado diga otra cosa:

- Usuario: `student`
- Contraseña: `Ex156Pass!`
- SSH con clave si configuraste `userData` con tu pubkey

Cirros usa `cirros` / `gocubsgo` si importas esa imagen sin cloud-init custom.
