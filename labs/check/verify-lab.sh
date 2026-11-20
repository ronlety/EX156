#!/usr/bin/env bash
# Verifica un lab individual: ./verify-lab.sh 02|03|04|05|06|07|exam
set -euo pipefail

LAB="${1:-}"
case "$LAB" in
  01|1) NS=ex156-lab01; VMS=(web-catalog) ;;
  02|2) NS=ex156-lab02; VMS=(cli-vm) ;;
  03|3) NS=ex156-lab03; VMS=(net-default net-udn) ;;
  04|4) NS=ex156-lab04; VMS=(app-vm) ;;
  05|5) NS=ex156-lab05; VMS=(storage-vm) ;;
  06|6) NS=ex156-lab06; VMS=(snap-src snap-clone) ;;
  07|7) NS=ex156-lab07; VMS=(legacy-web) ;;
  exam) exec "$(dirname "$0")/verify-all.sh" ex156-exam ;;
  *)
    echo "Usage: $0 {01|02|03|04|05|06|07|exam}"
    exit 2
    ;;
esac

echo "== Lab $LAB / project $NS =="
FAIL=0
for vm in "${VMS[@]}"; do
  st=$(oc get vm "$vm" -n "$NS" -o jsonpath='{.status.printableStatus}' 2>/dev/null || echo Missing)
  if [[ "$st" == "Running" ]]; then
    echo "  PASS  vm/$vm Running"
  else
    echo "  FAIL  vm/$vm status=$st"
    FAIL=$((FAIL + 1))
  fi
done

case "$LAB" in
  04|4)
    oc get svc app-vm-lb -n "$NS" >/dev/null && echo "  PASS  svc/app-vm-lb" || { echo "  FAIL  svc/app-vm-lb"; FAIL=$((FAIL+1)); }
    ;;
  05|5)
    ph=$(oc get pvc storage-vm-data -n "$NS" -o jsonpath='{.status.phase}' 2>/dev/null || echo Missing)
    [[ "$ph" == "Bound" ]] && echo "  PASS  pvc/storage-vm-data Bound" || { echo "  FAIL  pvc phase=$ph"; FAIL=$((FAIL+1)); }
    ;;
  03|3)
    oc get net-attach-def lab-udn -n "$NS" >/dev/null 2>&1 \
      || oc get userdefinednetwork lab-udn -n "$NS" >/dev/null 2>&1 \
      && echo "  PASS  lab-udn network present" \
      || { echo "  FAIL  lab-udn network missing"; FAIL=$((FAIL+1)); }
    ;;
esac

exit "$FAIL"
