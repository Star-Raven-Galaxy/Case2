# ===========================================
# Smoke-тест для Equipment Maintenance API
# Запуск: powershell -ExecutionPolicy Bypass -File smoke.ps1
# ===========================================

$BASE_URL = "http://localhost:3000"
$PASS = 0
$FAIL = 0

function Check($name, $expected, $actual) {
    if ("$expected" -eq "$actual") {
        Write-Host "[OK]   $name (expected $expected, got $actual)" -ForegroundColor Green
        $script:PASS++
    } else {
        Write-Host "[FAIL] $name (expected $expected, got $actual)" -ForegroundColor Red
        $script:FAIL++
    }
}

function Get-StatusCode($scriptBlock) {
    try {
        & $scriptBlock | Out-Null
        return 200
    } catch {
        return $_.Exception.Response.StatusCode.value__
    }
}

Write-Host ""
Write-Host "=== Smoke tests against $BASE_URL ===" -ForegroundColor Cyan
Write-Host ""

# -------------------------------------------
# 1. Health
# -------------------------------------------
Write-Host "--- Health ---" -ForegroundColor Yellow
$health = Invoke-RestMethod "$BASE_URL/api/health"
Check "GET /api/health" "ok" $health.status

# -------------------------------------------
# 2. Equipment list (empty)
# -------------------------------------------
Write-Host ""
Write-Host "--- Equipment list ---" -ForegroundColor Yellow
$list = Invoke-RestMethod "$BASE_URL/api/equipment"
Check "GET /api/equipment total" "0" $list.total
Check "GET /api/equipment page" "1" $list.page
Check "GET /api/equipment limit" "10" $list.limit

# -------------------------------------------
# 3. Create equipment
# -------------------------------------------
Write-Host ""
Write-Host "--- Create equipment ---" -ForegroundColor Yellow
$serial = "SN-" + (Get-Random)
$body = @{
    name = "Turbine Smoke"
    type = "turbine"
    serialNumber = $serial
    location = @{ lat = 55.75; lon = 37.62 }
    status = "operational"
    installedAt = "2024-01-15T10:00:00.000Z"
} | ConvertTo-Json

$created = Invoke-RestMethod -Uri "$BASE_URL/api/equipment" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body

$equipmentId = $created.data.id
Check "POST /api/equipment" "Turbine Smoke" $created.data.name
Check "POST /api/equipment has id" "True" ($null -ne $equipmentId)
Check "POST /api/equipment createdAt" "True" ($null -ne $created.data.createdAt)
Write-Host "  -> equipmentId: $equipmentId" -ForegroundColor Gray

# -------------------------------------------
# 4. Duplicate serialNumber (409)
# -------------------------------------------
Write-Host ""
Write-Host "--- Duplicate serialNumber ---" -ForegroundColor Yellow
$dupStatus = Get-StatusCode {
    Invoke-RestMethod -Uri "$BASE_URL/api/equipment" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body
}
Check "POST duplicate serialNumber" "409" $dupStatus

# -------------------------------------------
# 5. Invalid body (422)
# -------------------------------------------
Write-Host ""
Write-Host "--- Invalid body ---" -ForegroundColor Yellow
$badBody = @{
    name = "A"
    type = "unknown"
    serialNumber = ""
    location = @{ lat = 100; lon = 200 }
    status = "operational"
    installedAt = "2030-01-01T00:00:00.000Z"
} | ConvertTo-Json

$badStatus = Get-StatusCode {
    Invoke-RestMethod -Uri "$BASE_URL/api/equipment" `
        -Method Post `
        -ContentType "application/json" `
        -Body $badBody
}
Check "POST invalid body" "422" $badStatus

# -------------------------------------------
# 6. Unknown ID (404)
# -------------------------------------------
Write-Host ""
Write-Host "--- Unknown equipment ---" -ForegroundColor Yellow
$notFoundStatus = Get-StatusCode {
    Invoke-RestMethod -Uri "$BASE_URL/api/equipment/00000000-0000-0000-0000-000000000000"
}
Check "GET unknown equipment" "404" $notFoundStatus

# -------------------------------------------
# 7. Invalid UUID (422)
# -------------------------------------------
Write-Host ""
Write-Host "--- Invalid UUID ---" -ForegroundColor Yellow
$badUuidStatus = Get-StatusCode {
    Invoke-RestMethod -Uri "$BASE_URL/api/equipment/not-a-uuid"
}
Check "GET invalid UUID" "422" $badUuidStatus

# -------------------------------------------
# 8. Create request
# -------------------------------------------
Write-Host ""
Write-Host "--- Create request ---" -ForegroundColor Yellow
$requestBody = @{
    equipmentId = $equipmentId
    title = "Smoke request"
    priority = "medium"
} | ConvertTo-Json

$request = Invoke-RestMethod -Uri "$BASE_URL/api/requests" `
    -Method Post `
    -ContentType "application/json" `
    -Body $requestBody

$requestId = $request.data.id
Check "POST /api/requests" "new" $request.data.status
Check "POST /api/requests has id" "True" ($null -ne $requestId)
Write-Host "  -> requestId: $requestId" -ForegroundColor Gray

# -------------------------------------------
# 9. Change status new -> in_progress
# -------------------------------------------
Write-Host ""
Write-Host "--- Change status ---" -ForegroundColor Yellow
$status1 = Invoke-RestMethod -Uri "$BASE_URL/api/requests/$requestId/status" `
    -Method Patch `
    -ContentType "application/json" `
    -Body (@{ status = "in_progress" } | ConvertTo-Json)
Check "PATCH status new -> in_progress" "in_progress" $status1.data.status

# -------------------------------------------
# 10. Change status in_progress -> done
# -------------------------------------------
$status2 = Invoke-RestMethod -Uri "$BASE_URL/api/requests/$requestId/status" `
    -Method Patch `
    -ContentType "application/json" `
    -Body (@{ status = "done" } | ConvertTo-Json)
Check "PATCH status in_progress -> done" "done" $status2.data.status

# -------------------------------------------
# 11. Invalid transition done -> in_progress (409)
# -------------------------------------------
Write-Host ""
Write-Host "--- Invalid transition ---" -ForegroundColor Yellow
$invalidTransition = Get-StatusCode {
    Invoke-RestMethod -Uri "$BASE_URL/api/requests/$requestId/status" `
        -Method Patch `
        -ContentType "application/json" `
        -Body (@{ status = "in_progress" } | ConvertTo-Json)
}
Check "PATCH invalid transition" "409" $invalidTransition

# -------------------------------------------
# 12. Delete equipment with open requests (409)
# -------------------------------------------
Write-Host ""
Write-Host "--- Delete with open requests ---" -ForegroundColor Yellow

# Создаём новую открытую заявку
$openRequestBody = @{
    equipmentId = $equipmentId
    title = "Open request"
    priority = "low"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$BASE_URL/api/requests" `
    -Method Post `
    -ContentType "application/json" `
    -Body $openRequestBody | Out-Null

# Пытаемся удалить оборудование
$deleteStatus = Get-StatusCode {
    Invoke-RestMethod -Uri "$BASE_URL/api/equipment/$equipmentId" -Method Delete
}
Check "DELETE equipment with open requests" "409" $deleteStatus

# -------------------------------------------
# 13. Nested resource: requests by equipment
# -------------------------------------------
Write-Host ""
Write-Host "--- Nested resource ---" -ForegroundColor Yellow
$nested = Invoke-RestMethod "$BASE_URL/api/equipment/$equipmentId/requests"
Check "GET /api/equipment/:id/requests" "True" ($nested.data.Count -gt 0)

# -------------------------------------------
# 14. Unknown route (404)
# -------------------------------------------
Write-Host ""
Write-Host "--- Unknown route ---" -ForegroundColor Yellow
$unknownRoute = Get-StatusCode {
    Invoke-RestMethod "$BASE_URL/api/unknown"
}
Check "GET /api/unknown" "404" $unknownRoute

# -------------------------------------------
# Итог
# -------------------------------------------
Write-Host ""
Write-Host "=== Results ===" -ForegroundColor Cyan
Write-Host "Passed: $PASS" -ForegroundColor Green
Write-Host "Failed: $FAIL" -ForegroundColor $(if ($FAIL -gt 0) { "Red" } else { "Green" })
Write-Host ""

if ($FAIL -gt 0) {
    exit 1
} else {
    Write-Host "All smoke tests passed!" -ForegroundColor Green
    exit 0
}