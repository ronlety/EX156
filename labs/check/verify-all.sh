#!/usr/bin/env bash
# Autocheck liviano estilo examen. Uso:
#   ./verify-all.sh [namespace]
#   ./verify-all.sh ex156-exam
set -euo pipefail

NS="${1:-ex156-exam}"
PASS=0
FAIL=0

ok() { echo "  PASS  $*"; PASS=$((PASS + 1)); }
ko() { echo "  FAIL  $*"; FAIL=$((FAIL + 1)); }

need() {
  local kind="$1" name="$2"
  if oc get "$kind" "$name" -n "$NS" >/dev/null 2>&1; then
    ok "$kind/$name exists"
  else
    ko "$kind/$name missing"
  fi
}

vm_running() {
  local name="$1"
  local st
  st=$(oc get vm "$name" -n "$NS" -o jsonpath='{.status.printableStatus}' 2>/dev/null || echo Missing)
  if [[ "$st" == "Running" ]]; then
    ok "vm/$name is Running"
  else
    ko "vm/$name status=$st (want Running)"
  fi
}

echo "== EX156 verify in namespace: $NS =="
oc project "$NS" >/dev/null

echo "-- Core VMs --"
for vm in shop-frontend shop-db shop-cache shop-frontend-clone legacy-web; do
  if oc get vm "$vm" -n "$NS" >/dev/null 2>&1; then
    vm_running "$vm"
  else
    echo "  SKIP  vm/$vm (not present in this namespace)"
  fi
done

echo "-- Labels shop-db --"
if oc get vm shop-db -n "$NS" >/dev/null 2>&1; then
  labels=$(oc get vm shop-db -n "$NS" -o jsonpath='{.metadata.labels}' 2>/dev/null || true)
  echo "$labels" | grep -q 'shop' && ok "shop-db has shop-related labels" || ko "shop-db labels: $labels"
fi

echo "-- Service LB --"
if oc get svc shop-frontend-lb -n "$NS" >/dev/null 2>&1; then
  ok "svc/shop-frontend-lb exists"
  ep=$(oc get endpoints shop-frontend-lb -n "$NS" -o jsonpath='{.subsets[*].addresses[*].ip}' 2>/dev/null || true)
  [[ -n "${ep:-}" ]] && ok "shop-frontend-lb has endpoints ($ep)" || ko "shop-frontend-lb has no endpoints"
else
  echo "  SKIP  svc/shop-frontend-lb"
fi

echo "-- Extra disk --"
if oc get pvc shop-frontend-data -n "$NS" >/dev/null 2>&1; then
  phase=$(oc get pvc shop-frontend-data -n "$NS" -o jsonpath='{.status.phase}')
  [[ "$phase" == "Bound" ]] && ok "pvc/shop-frontend-data Bound" || ko "pvc/shop-frontend-data phase=$phase"
else
  echo "  SKIP  pvc/shop-frontend-data"
fi

echo "-- Snapshot / clone artifacts --"
oc get vmsnapshot,vmrestore,vmclone -n "$NS" 2>/dev/null || true

echo "-- Networks --"
oc get userdefinednetwork,clusteruserdefinednetwork,net-attach-def -n "$NS" 2>/dev/null || true

echo
echo "Result: $PASS passed, $FAIL failed"
[[ "$FAIL" -eq 0 ]]
