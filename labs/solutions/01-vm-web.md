# Solución — Lab 01 (web)

## Pasos típicos en consola

1. **Virtualization → VirtualMachines → Create**.
2. Elige plantilla/InstanceType pequeño o “YAML”.
3. Nombre: `web-catalog`, proyecto `ex156-lab01`.
4. En cloud-init / scripts:

```yaml
#cloud-config
user: student
password: Ex156Pass!
chpasswd: { expire: False }
ssh_pwauth: True
```

5. Create → espera DV Succeeded → VM Running.
6. Pestaña **Console** (VNC).
7. Actions → Stop → Start.

## Verificación CLI

```bash
oc project ex156-lab01
oc get vm web-catalog -o jsonpath='{.status.printableStatus}{"\n"}'
```

Si no hay plantillas: crea con el YAML del lab 02 cambiando nombre/proyecto y ábrela luego desde la UI.
