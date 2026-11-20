window.EX156_QUESTIONS = [
  // —— Crear y gestionar VMs ——
  {
    id: 1,
    domain: "Crear y gestionar VMs",
    text: "¿Qué recurso de API de OpenShift Virtualization representa la definición deseada de una máquina virtual?",
    options: [
      "VirtualMachineInstance (VMI)",
      "VirtualMachine (VM)",
      "DataVolume",
      "virt-launcher Pod"
    ],
    answer: 1,
    explain: "VirtualMachine (kubevirt.io/v1) es el recurso que describe la VM deseada (running/stopped, plantilla, discos, redes). La VMI es la instancia en ejecución; el Pod virt-launcher la hospeda."
  },
  {
    id: 2,
    domain: "Crear y gestionar VMs",
    text: "Al arrancar una VM, ¿qué crea OpenShift Virtualization para ejecutar el proceso QEMU/KVM?",
    options: [
      "Un Deployment con réplicas iguales a la cantidad de vCPUs",
      "Un Pod virt-launcher asociado a una VirtualMachineInstance",
      "Un Job one-shot llamado virt-handler",
      "Un DaemonSet por proyecto de la VM"
    ],
    answer: 1,
    explain: "Cada VMI en ejecución se materializa como un Pod virt-launcher. virt-handler (DaemonSet en nodos) y el control plane de KubeVirt orquestan ese ciclo de vida."
  },
  {
    id: 3,
    domain: "Crear y gestionar VMs",
    text: "¿Qué comando de virtctl inicia una VirtualMachine llamada web-vm en el proyecto actual?",
    options: [
      "virtctl start web-vm",
      "oc start vm/web-vm",
      "virtctl run web-vm --start",
      "oc patch vm web-vm --type merge -p '{\"spec\":{\"running\":true}}' es la única opción válida"
    ],
    answer: 0,
    explain: "virtctl start <vm> es la forma habitual. También puedes poner spec.runStrategy/running en el manifiesto; oc patch funciona, pero no es la única vía."
  },
  {
    id: 4,
    domain: "Crear y gestionar VMs",
    text: "Quieres una consola gráfica VNC de una VM. ¿Cuál es el flujo típico con virtctl?",
    options: [
      "virtctl console <vm> abre VNC por defecto",
      "virtctl vnc <vm> (requiere cliente VNC local o proxy adecuado)",
      "oc rsh virt-launcher-<vm> vncviewer",
      "Solo es posible desde la consola web; virtctl no soporta VNC"
    ],
    answer: 1,
    explain: "virtctl vnc conecta a la consola gráfica. virtctl console es consola serial (texto). La consola web también ofrece VNC/serial."
  },
  {
    id: 5,
    domain: "Crear y gestionar VMs",
    text: "En un manifiesto de VM, ¿qué campo suele indicar si la VM debe estar encendida (según versiones/estilos comunes)?",
    options: [
      "metadata.annotations.kubevirt.io/start: \"true\"",
      "spec.running: true  o  spec.runStrategy: Always/Manual/RerunOnFailure",
      "status.printableStatus: Running",
      "spec.template.spec.running: true"
    ],
    answer: 1,
    explain: "El estado deseado se controla con spec.running (legado) o spec.runStrategy. status.* refleja el estado observado, no la intención."
  },
  {
    id: 6,
    domain: "Crear y gestionar VMs",
    text: "¿Dónde defines CPU, memoria y dispositivos de una VM en el recurso VirtualMachine?",
    options: [
      "En spec.resources del objeto VirtualMachine (nivel raíz)",
      "En spec.template.spec.domain (resources, devices, disks, interfaces)",
      "Solo mediante InstanceType; no se puede declarar en el YAML de la VM",
      "En el ConfigMap kubevirt-config del namespace de la VM"
    ],
    answer: 1,
    explain: "La plantilla de instancia vive en spec.template; domain describe CPU/RAM, discs, interfaces, firmwares, etc. Los InstanceTypes son una alternativa/complemento, no un requisito exclusivo."
  },
  {
    id: 7,
    domain: "Crear y gestionar VMs",
    text: "Observa este fragmento. ¿Qué hace cloud-init aquí?",
    code: "volumes:\n  - name: cloudinitdisk\n    cloudInitNoCloud:\n      userData: |\n        #cloud-config\n        password: redhat\n        chpasswd: { expire: False }\n        ssh_pwauth: True",
    options: [
      "Monta un ISO de instalación de RHEL",
      "Inyecta configuración de primer arranque (usuario/SSH) vía disco cloud-init",
      "Crea un Secret con la contraseña y lo monta en /etc/shadow",
      "Habilita live migration automática"
    ],
    answer: 1,
    explain: "cloudInitNoCloud genera un volumen con user-data que cloud-init consume en el guest para configurar red, usuarios, SSH, etc."
  },
  {
    id: 8,
    domain: "Crear y gestionar VMs",
    text: "Desde la consola web de OpenShift, la ruta habitual para crear una VM con OpenShift Virtualization es:",
    options: [
      "Administrator → Cluster Settings → Virtualization",
      "Virtualization → Catalog / VirtualMachines → Create",
      "Workloads → Deployments → Add Virtual Machine",
      "Storage → PersistentVolumeClaims → Create VM"
    ],
    answer: 1,
    explain: "El plugin de Virtualization añade la perspectiva/sección Virtualization con catálogo, listado de VMs y asistentes de creación."
  },
  {
    id: 9,
    domain: "Crear y gestionar VMs",
    text: "¿Qué comando lista VirtualMachines en el proyecto actual?",
    options: [
      "oc get pods -l kubevirt.io=virt-launcher",
      "oc get vm  (o  oc get virtualmachines)",
      "virtctl list --all-namespaces",
      "oc get nodes -o wide"
    ],
    answer: 1,
    explain: "oc get vm / virtualmachines lista el recurso CR. Los pods virt-launcher son la carga en ejecución, no la definición de la VM."
  },
  {
    id: 10,
    domain: "Crear y gestionar VMs",
    text: "Una VM está Running pero no responde por SSH. ¿Cuál es un primer paso útil de diagnóstico?",
    options: [
      "Eliminar el namespace completo y recrearlo",
      "Revisar oc get vmi, oc describe vmi/vm, logs del virt-launcher y consola serial (virtctl console)",
      "Desactivar SELinux en todos los workers",
      "Escalar el Deployment kube-apiserver a 0"
    ],
    answer: 1,
    explain: "Diagnóstico típico: estado de VMI/VM, eventos, logs del pod virt-launcher, consola serial/VNC y conectividad de red/servicio."
  },
  {
    id: 11,
    domain: "Crear y gestionar VMs",
    text: "¿Qué relación hay entre VirtualMachine e InstanceType / Preference?",
    options: [
      "Reemplazan por completo el manifiesto de la VM; ya no se usa VirtualMachine",
      "Permiten referenciar perfiles reutilizables de tamaño/preferencias en lugar de duplicar resources en cada VM",
      "Solo aplican a contenedores, no a VMs",
      "Son obligatorios para cualquier VM en EX156"
    ],
    answer: 1,
    explain: "VirtualMachineInstanceType y Preferencias encapsulan sizing y defaults; la VM puede referenciarlos para estandarizar despliegues."
  },
  {
    id: 12,
    domain: "Crear y gestionar VMs",
    text: "Para detener una VM de forma ordenada con virtctl usas:",
    options: [
      "virtctl delete web-vm",
      "virtctl stop web-vm",
      "oc delete pod -l kubevirt.io/domain=web-vm --force",
      "virtctl pause web-vm --permanent"
    ],
    answer: 1,
    explain: "virtctl stop solicita apagado según la estrategia configurada. Borrar el pod a la fuerza es destructivo y no es el flujo correcto de administración."
  },

  // —— Redes ——
  {
    id: 13,
    domain: "Redes de VMs",
    text: "Por defecto, una interfaz de VM conectada a la red del pod (pod networking) obtiene conectividad:",
    options: [
      "Solo L2 bridged al físico del nodo, sin IP de cluster",
      "Como un pod: IP del SDN/OVN del cluster y DNS de servicio según políticas",
      "Únicamente IPv6 link-local",
      "Acceso exclusivo a la red de management de OpenShift"
    ],
    answer: 1,
    explain: "La red por defecto (masquerade/pod network) trata la VM de forma similar a un pod en la red del cluster."
  },
  {
    id: 14,
    domain: "Redes de VMs",
    text: "¿Qué es una User-Defined Network (UDN) en el contexto reciente de OpenShift / Virtualization?",
    options: [
      "Un alias de Service de tipo ClusterIP",
      "Una red definida por el usuario (a menudo aislada/segmentada) a la que las VMs pueden conectarse además o en lugar de solo la red por defecto",
      "El bridge virbr0 de libvirt en el bastion",
      "Un NetworkPolicy que deniega todo el tráfico egress"
    ],
    answer: 1,
    explain: "Las UDN permiten topologías de red definidas por el usuario para cargas (incluidas VMs), más allá de la red pod por defecto."
  },
  {
    id: 15,
    domain: "Redes de VMs",
    text: "Una VM multihomed significa que:",
    options: [
      "Tiene réplicas en varios nodos a la vez",
      "Tiene más de una interfaz de red (p. ej. pod network + UDN/bridge secundario)",
      "Usa dual-stack IPv4/IPv6 obligatorio",
      "Está clonada en dos StorageClasses"
    ],
    answer: 1,
    explain: "Multihoming = múltiples NICs/interfaces en la guest, cada una unida a redes distintas según el manifiesto (interfaces + networks)."
  },
  {
    id: 16,
    domain: "Redes de VMs",
    text: "En el YAML de una VM, ¿dónde se declaran las interfaces y a qué red se unen?",
    options: [
      "Solo en un ConfigMap separado llamado networks",
      "spec.template.spec.domain.devices.interfaces  +  spec.template.spec.networks",
      "metadata.labels.network.openshift.io",
      "spec.running.networks"
    ],
    answer: 1,
    explain: "devices.interfaces define el tipo (masquerade, bridge, SR-IOV…) y networks asocia cada interfaz a pod/multus/UDN/etc."
  },
  {
    id: 17,
    domain: "Redes de VMs",
    text: "Para exponer un servicio HTTP de una VM hacia fuera del cluster de forma similar a un pod, lo habitual es:",
    options: [
      "Abrir puertos en el firewall de cada worker manualmente con firewall-cmd",
      "Crear un Service (ClusterIP/NodePort/LoadBalancer) que seleccione la VM/VMI y, si aplica, una Route",
      "Usar solo virtctl expose --host-network",
      "Publicar el puerto con EXPOSE en un Containerfile de la VM"
    ],
    answer: 1,
    explain: "Las VMs se integran con Services de Kubernetes mediante labels del VMI/pod. LoadBalancer o Route cubren acceso externo según la plataforma."
  },
  {
    id: 18,
    domain: "Redes de VMs",
    text: "El examen EX156 menciona configurar acceso externo con load balancer services. Eso implica:",
    options: [
      "Instalar MetalLB o usar el LB del cloud y un Service type: LoadBalancer hacia la VM",
      "Configurar haproxy solo en el bastion del examen",
      "Cambiar el IngressController a HostNetwork",
      "Crear un EndpointSlice vacío"
    ],
    answer: 0,
    explain: "Un Service LoadBalancer obtiene una IP/hostname externo (cloud o MetalLB on-prem) y balancea hacia los endpoints de la VM."
  },
  {
    id: 19,
    domain: "Redes de VMs",
    text: "Observa el Service. ¿Qué debe cumplirse para que llegue tráfico a la VM?",
    code: "apiVersion: v1\nkind: Service\nmetadata:\n  name: web-vm-svc\nspec:\n  type: LoadBalancer\n  selector:\n    kubevirt.io/domain: web-vm\n  ports:\n    - port: 80\n      targetPort: 8080",
    options: [
      "Nada más: el selector de dominio siempre existe por defecto sin labels",
      "La VMI/pod debe tener labels que coincidan (p. ej. kubevirt.io/domain=web-vm) y el guest debe escuchar en 8080",
      "El Service debe llamarse igual que la VM",
      "targetPort se ignora en VMs; siempre es el puerto 22"
    ],
    answer: 1,
    explain: "Como con pods, el selector debe matchear labels de la instancia. El guest debe escuchar en targetPort; port es el del Service."
  },
  {
    id: 20,
    domain: "Redes de VMs",
    text: "La interfaz tipo masquerade en KubeVirt/OpenShift Virtualization típica mente:",
    options: [
      "Conecta la NIC directamente al bridge físico sin NAT",
      "Usa NAT respecto a la IP del pod, adecuada para la red por defecto del cluster",
      "Requiere SR-IOV obligatoriamente",
      "Deshabilita DHCP en el guest"
    ],
    answer: 1,
    explain: "masquerade es el binding habitual a la pod network: la VM queda detrás de NAT de la IP del virt-launcher."
  },
  {
    id: 21,
    domain: "Redes de VMs",
    text: "Para unir una VM a una red adicional (p. ej. NAD/Multus o UDN), normalmente necesitas:",
    options: [
      "Solo reiniciar el node networking.service",
      "Definir la red en el cluster y referenciarla en spec.template.spec.networks / interfaces de la VM",
      "Añadir hostNetwork: true en el Pod virt-handler",
      "Crear un Deployment proxy en el mismo nodo"
    ],
    answer: 1,
    explain: "Las redes secundarias se modelan como recursos de red del cluster y se referencian desde el spec de la VM (interfaces + networks)."
  },
  {
    id: 22,
    domain: "Redes de VMs",
    text: "¿Qué comando ayuda a comprobar endpoints de un Service que apunta a una VM?",
    options: [
      "oc get endpoints <svc>  /  oc get endpointslices",
      "virtctl network-status --global",
      "oc adm top nodes --vms",
      "nmcli device show virtctl"
    ],
    answer: 0,
    explain: "Si no hay Endpoints, el selector no matchea o la VMI no está lista. Es el mismo troubleshooting que con pods."
  },

  // —— Almacenamiento ——
  {
    id: 23,
    domain: "Almacenamiento de VMs",
    text: "En OpenShift Virtualization, un disco persistente de VM suele respaldarse en:",
    options: [
      "Un emptyDir en el virt-launcher (siempre)",
      "Un PersistentVolumeClaim (a menudo creado/gestionado vía DataVolume / DataSource)",
      "Un ConfigMap de 1 GiB",
      "Solo archivos en /var/lib/libvirt del bastion"
    ],
    answer: 1,
    explain: "Los discos viven en PVCs. DataVolume (CDI) facilita import/clone/upload hacia esos PVCs."
  },
  {
    id: 24,
    domain: "Almacenamiento de VMs",
    text: "¿Para qué sirve el Containerized Data Importer (CDI) en este contexto?",
    options: [
      "Sustituye a etcd como almacén de estado",
      "Importar, subir y clonar imágenes de disco hacia PVCs/DataVolumes para VMs",
      "Compilar el kernel del guest",
      "Gestionar rutas HTTP del IngressController"
    ],
    answer: 1,
    explain: "CDI provee DataVolumes y flujos de import/upload/clone de discos usados por OpenShift Virtualization."
  },
  {
    id: 25,
    domain: "Almacenamiento de VMs",
    text: "Para importar una imagen de disco desde una URL HTTP(S) a un PVC, el patrón habitual es:",
    options: [
      "oc cp la imagen al API server",
      "Crear un DataVolume (o VM con dataVolumeTemplates) con source.http.url",
      "Usar podman pull sobre un .qcow2",
      "Montar la URL como NFS export"
    ],
    answer: 1,
    explain: "DataVolume con source http/s3/registry/upload orquesta el populate del PVC. Las VM templates suelen embeber dataVolumeTemplates."
  },
  {
    id: 26,
    domain: "Almacenamiento de VMs",
    text: "¿Qué representa un snapshot de VM en OpenShift Virtualization?",
    options: [
      "Una copia del YAML de la VM en Git",
      "Un punto en el tiempo del estado de discos (y metadatos asociados) para restaurar o clonar",
      "Un checkpoint solo de la memoria RAM, nunca de disco",
      "Un backup automático a S3 sin PVC"
    ],
    answer: 1,
    explain: "Los VirtualMachineSnapshot capturan el estado de volúmenes (según capabilities del storage) para restore/clone posteriores."
  },
  {
    id: 27,
    domain: "Almacenamiento de VMs",
    text: "Antes de crear un snapshot consistente, una buena práctica suele ser:",
    options: [
      "Eliminar todos los PVCs de la VM",
      "Asegurar que el storage class/CSI soporta snapshots y que la VM/discos están en estado adecuado (a menudo apagada o con guest agent según el caso)",
      "Cambiar la VM a hostPath",
      "Deshabilitar CDI"
    ],
    answer: 1,
    explain: "VolumeSnapshots dependen del CSI. El estado de la VM y el guest agent influyen en la consistencia; sigue la guía del producto para el flujo exacto."
  },
  {
    id: 28,
    domain: "Almacenamiento de VMs",
    text: "Clonar una VM típicamente implica:",
    options: [
      "Solo copiar el objeto VirtualMachine sin discos",
      "Crear una nueva VM cuyos discos se pueblan clonando PVCs/DataVolumes (o desde snapshot) de la origen",
      "Duplicar el Pod virt-launcher con oc scale",
      "Hacer oc edit en la VM origen cambiando metadata.name"
    ],
    answer: 1,
    explain: "El clon útil incluye almacenamiento. CDI/clone o restauración desde snapshot generan nuevos PVCs para la VM destino."
  },
  {
    id: 29,
    domain: "Almacenamiento de VMs",
    text: "Para adjuntar un disco adicional a una VM existente, el flujo conceptual es:",
    options: [
      "Añadir un volumen/disco en el spec de la VM (PVC/DV/DataSource) y reiniciar o hotplug según soporte",
      "Crear un segundo objeto VirtualMachine con el mismo nombre",
      "Añadir una annotation only: storage.openshift.io/attach",
      "Formatear el etcd member"
    ],
    answer: 0,
    explain: "Se declara otro disk + volume apuntando a un PVC/DV. Según versión y bus (virtio-scsi, etc.) puede haber hotplug; si no, reinicio de la VM."
  },
  {
    id: 30,
    domain: "Almacenamiento de VMs",
    text: "Importar una VM previamente exportada suele involucrar:",
    options: [
      "Rehidratar manifiestos + discos (export/import API o archivos/PVC) en el cluster destino",
      "Solo restaurar el etcd del cluster origen",
      "Usar scp del binario qemu-kvm",
      "Publicar la VM como imagen OCI en Quay sin discos"
    ],
    answer: 0,
    explain: "OpenShift Virtualization ofrece flujos de export/import de VMs (y/o import de discos vía CDI). Hay que recrear definición + almacenamiento."
  },
  {
    id: 31,
    domain: "Almacenamiento de VMs",
    text: "Observa este dataVolumeTemplate. ¿Qué StorageClass usará el PVC resultante si no se sobrescribe?",
    code: "dataVolumeTemplates:\n  - metadata:\n      name: web-vm-rootdisk\n    spec:\n      storage:\n        resources:\n          requests:\n            storage: 30Gi\n        storageClassName: ocs-storagecluster-ceph-rbd",
    options: [
      "La StorageClass por defecto del cluster, ignorando el YAML",
      "ocs-storagecluster-ceph-rbd",
      "hostpath-csi-basic siempre",
      "Ninguna; DataVolume no crea PVCs"
    ],
    answer: 1,
    explain: "storageClassName en el spec del DataVolume/PVC fija la clase. Si se omite, entra la default del cluster."
  },
  {
    id: 32,
    domain: "Almacenamiento de VMs",
    text: "Un PVC en modo ReadWriteMany (RWX) es especialmente relevante cuando:",
    options: [
      "La VM solo se ejecuta en un único nodo y nunca migra",
      "Se necesita live migration u otros escenarios donde el disco debe montarse en más de un nodo",
      "Solo se usan emptyDir",
      "Se desactiva KubeVirt"
    ],
    answer: 1,
    explain: "Live migration exige que el almacenamiento del disco sea accesible en origen y destino (típicamente RWX o shared storage adecuado)."
  },
  {
    id: 33,
    domain: "Almacenamiento de VMs",
    text: "¿Qué recurso se usa a menudo para restaurar una VM desde un VirtualMachineSnapshot?",
    options: [
      "VirtualMachineClone o VirtualMachineRestore (según el flujo/versión)",
      "ReplicaSet",
      "HorizontalPodAutoscaler",
      "NetworkPolicy"
    ],
    answer: 0,
    explain: "Los CR de restore/clone de Virtualization aplican el snapshot a una VM nueva o existente según el API del producto."
  },
  {
    id: 34,
    domain: "Almacenamiento de VMs",
    text: "Al subir un disco local (.qcow2/.raw) al cluster con CDI, una herramienta CLI típica es:",
    options: [
      "virtctl image-upload (o flujos equivalentes de upload proxy de CDI)",
      "oc adm release mirror",
      "podman save | oc apply -f -",
      "rsync al master-0"
    ],
    answer: 0,
    explain: "virtctl image-upload habla con el upload proxy de CDI para poblar un PVC/DV desde un archivo local."
  },

  // —— Conceptos transversales / DO156 ——
  {
    id: 35,
    domain: "Crear y gestionar VMs",
    text: "OpenShift Virtualization se instala principalmente mediante:",
    options: [
      "RPM qemu-kvm en cada worker sin Operator",
      "El Operator OpenShift Virtualization (KubeVirt) vía OperatorHub / OLM",
      "Un único pod estático en openshift-ingress",
      "El paquete virt-manager en el bastion"
    ],
    answer: 1,
    explain: "EX156 asume el operador ya disponible; DO156 cubre desplegarlo con OLM. En el examen de technologist te centras en operar VMs."
  },
  {
    id: 36,
    domain: "Crear y gestionar VMs",
    text: "La regla de rendimiento de los exámenes Red Hat implica que tus VMs y servicios deben:",
    options: [
      "Funcionar solo mientras la sesión VNC esté abierta",
      "Persistir y seguir operativos tras reinicios normales del ciclo de vida, sin arreglo manual constante",
      "Depender de alias temporales en /tmp del bastion",
      "Usar --force en todos los comandos oc"
    ],
    answer: 1,
    explain: "Las configuraciones deben quedar aplicadas en la plataforma (CRs, Services, PVC) de forma duradera."
  },
  {
    id: 37,
    domain: "Redes de VMs",
    text: "Si creas un Service tipo ClusterIP para una VM, el acceso desde otra VM en el cluster:",
    options: [
      "Es imposible; ClusterIP solo funciona con contenedores",
      "Funciona vía DNS/IP del Service si hay conectividad de red y labels correctos, igual que con pods",
      "Requiere siempre NodePort",
      "Requiere hostNetwork en ambas VMs"
    ],
    answer: 1,
    explain: "ClusterIP es interno al cluster. Las VMs en la pod network pueden usarlo como cualquier cliente."
  },
  {
    id: 38,
    domain: "Almacenamiento de VMs",
    text: "Un DataVolume en fase Succeeded indica que:",
    options: [
      "La VM ya está Running",
      "El PVC asociado fue poblado correctamente (import/clone/upload terminó)",
      "Se eliminó el PVC",
      "Falló el CSI driver"
    ],
    answer: 1,
    explain: "Succeeded = disco listo en el PVC. La VM es un recurso aparte que consume ese volumen."
  },
  {
    id: 39,
    domain: "Crear y gestionar VMs",
    text: "¿Cuál es una diferencia clave entre el examen oficial EX156 y este simulacro?",
    options: [
      "Ninguna: Red Hat califica quizzes de opción múltiple igual que el EX156",
      "EX156 es 100% hands-on en un cluster real (~2 h); este banco es teórico para reforzar conceptos",
      "EX156 solo pregunta sobre Ansible",
      "EX156 se aprueba publicando un repo de GitHub"
    ],
    answer: 1,
    explain: "El examen real exige completar tareas en vivo. Practica también en un laboratorio con oc/virtctl y la consola."
  },
  {
    id: 40,
    domain: "Almacenamiento de VMs",
    text: "Para que un disco nuevo aparezca usable dentro del guest tras adjuntarlo, además del YAML de la VM suele hacer falta:",
    options: [
      "Nada: el guest siempre monta PVCs automáticamente en /mnt/pvc",
      "Particionar/formatear/montar (o cloud-init/automount) dentro del sistema operativo de la VM",
      "Ejecutar oc adm drain en todos los nodos",
      "Cambiar el Service a ExternalName"
    ],
    answer: 1,
    explain: "OpenShift adjunta el block/filesystem device a la VM; el SO invitado debe prepararlo y montarlo como en cualquier servidor."
  }
];
