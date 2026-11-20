# EX156 — Examen de práctica

Material de estudio para el **Red Hat Certified Technologist in OpenShift Virtualization (EX156)**.

El examen oficial es **práctico** (~2 horas) sobre OpenShift Container Platform. Este repo incluye:

1. **Quiz teórico** en el navegador (conceptos)
2. **Labs hands-on** estilo examen (tareas + soluciones + autocheck)

## Quiz teórico

Abre [index.html](index.html) o la página publicada: https://ronlety.github.io/EX156/

```bash
python3 -m http.server 8080
# http://localhost:8080
```

- 40 preguntas, orden aleatorio, 90 min, ≥ 70%
- Dominios: VMs, redes, almacenamiento

## Labs estilo examen

Ver **[labs/README.md](labs/README.md)**.

| Recurso | Descripción |
|---------|-------------|
| [labs/exam-brief.md](labs/exam-brief.md) | Simulacro completo 120 min (100 pts) |
| [labs/tasks/](labs/tasks/) | 7 labs por skill |
| [labs/solutions/](labs/solutions/) | Guías de solución (no mirar en simulacro) |
| [labs/check/](labs/check/) | Scripts `verify-lab.sh` / `verify-all.sh` |

```bash
# Tras el simulacro:
./labs/check/verify-all.sh ex156-exam
```

## Objetivos oficiales (resumen)

1. Crear y gestionar VMs (web y CLI)
2. Redes: UDN/predefinidas, multihoming, LoadBalancer
3. Almacenamiento: import, snapshots, clones, adjuntar discos

Preparación recomendada por Red Hat: **DO156**.

## Aviso

Material no oficial e independiente de Red Hat. No sustituye cursos, clusters de lab ni el examen EX156.
