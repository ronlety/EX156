# Solución — Lab 04 (multihomed + LB)

## 1. VM multihomed

En `app-vm`, declara dos interfaces como en la solución 03 (pod + `lab-udn`).

Labels importantes para el Service:

```yaml
template:
  metadata:
    labels:
      kubevirt.io/domain: app-vm
      app: app-vm
```

## 2. HTTP en el guest

Ejemplo cloud-init (Fedora/RHEL con python):

```yaml
userData: |
  #cloud-config
  password: Ex156Pass!
  chpasswd: { expire: False }
  ssh_pwauth: True
  runcmd:
    - mkdir -p /var/www
    - echo 'EX156-OK' > /var/www/index.html
    - python3 -m http.server 8080 --directory /var/www &
```

O manualmente por consola tras el boot.

## 3. Service LoadBalancer

```bash
cat <<'EOF' | oc apply -f -
apiVersion: v1
kind: Service
metadata:
  name: app-vm-lb
  namespace: ex156-lab04
spec:
  type: LoadBalancer
  selector:
    kubevirt.io/domain: app-vm
  ports:
    - name: http
      port: 80
      targetPort: 8080
      protocol: TCP
EOF
```

## 4. Prueba

```bash
oc get svc app-vm-lb -w
oc get endpoints app-vm-lb
EXT=$(oc get svc app-vm-lb -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
# o hostname:
# EXT=$(oc get svc app-vm-lb -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
curl -s http://$EXT/
```

### NodePort

```bash
oc patch svc app-vm-lb -p '{"spec":{"type":"NodePort"}}'
oc get svc app-vm-lb
# curl http://<node-ip>:<nodePort>/
```

Si no hay Endpoints: revisa labels de la VMI (`oc get vmi app-vm --show-labels`) y alinea el selector.
