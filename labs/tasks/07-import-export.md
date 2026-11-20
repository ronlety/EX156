# Lab 07 — Importar una VM exportada

**Dominio:** Gestionar almacenamiento de VMs  
**Tiempo:** ~40 min  
**Proyecto:** `ex156-lab07`

## Objetivos

- Exportar una VM de práctica (o usar el fixture)
- Importarla con el nombre y proyecto pedidos

## Preparación

```bash
oc new-project ex156-lab07
```

Hay dos caminos. Elige el que soporte tu cluster.

### Camino A — API VirtualMachineExport / Import (preferido si existe)

1. En un proyecto auxiliar, crea VM **`export-src`**, Running, luego deténla.
2. Crea un export y descarga manifiestos/discos según documentación.
3. Impórtalos en `ex156-lab07` como VM **`legacy-web`**.

### Camino B — Fixture + CDI (siempre viable)

Usa los archivos en [`../fixtures/legacy-web/`](../fixtures/legacy-web/):

1. Sube o importa el disco indicado.
2. Aplica el manifiesto de VM ajustando `storageClassName` y namespace.
3. Arranca **`legacy-web`**.

## Tareas (resultado final común)

1. En `ex156-lab07` debe existir **`VirtualMachine/legacy-web`**.
2. Estado **Running**.
3. Consola serial o VNC accesible.

## Criterios de evaluación

```bash
oc project ex156-lab07
oc get vm legacy-web
oc get vmi legacy-web
virtctl console legacy-web
# Ctrl+] para salir
```

- [ ] VM importada con el nombre exacto `legacy-web`
- [ ] Running
- [ ] Disco Bound

Solución: [`../solutions/07-import-export.md`](../solutions/07-import-export.md)
