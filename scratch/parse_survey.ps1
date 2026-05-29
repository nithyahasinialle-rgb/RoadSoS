$csvPath = "C:\Users\nithy\.gemini\antigravity\brain\6301b70a-6e08-4440-8ab8-ad4cccf50af4\.system_generated\steps\183\content.md"

# Skip the first 8 lines of metadata header
$rawLines = Get-Content -Path $csvPath
$csvContent = $rawLines[8..($rawLines.Count - 1)] | Out-String

# Convert CSV to objects
$records = ConvertFrom-Csv -InputObject $csvContent

$total = $records.Count

$witnessedYes = 0
$poorNetwork = 0
$trustYes = 0
$trustMaybe = 0
$challenges = @{}
$features = @{}

foreach ($rec in $records) {
    # Column names are long and multi-line, we access by index or property name patterns
    $properties = $rec | Get-Member -MemberType NoteProperty
    
    $ageGroupVal = ""
    $witnessedVal = ""
    $challengesVal = ""
    $networkVal = ""
    $trustVal = ""
    $featuresVal = ""
    
    foreach ($p in $properties) {
        $name = $p.Name
        $val = $rec.$name
        
        if ($name -like "*Age Group*") { $ageGroupVal = $val }
        elseif ($name -like "*witnessed*") { $witnessedVal = $val }
        elseif ($name -like "*challenge*") { $challengesVal = $val }
        elseif ($name -like "*travelling*") { $networkVal = $val }
        elseif ($name -like "*trust*") { $trustVal = $val }
        elseif ($name -like "*features*") { $featuresVal = $val }
    }
    
    # Witnessed
    if ($witnessedVal -like "*Yes*" -or $witnessedVal -like "*అవును*" -or $witnessedVal -like "*हाँ*") {
        $witnessedYes++
    }
    
    # Network
    if ($networkVal -like "*Sometimes*" -or $networkVal -like "*Frequently*" -or $networkVal -like "*కొన్నిసార్లు*" -or $networkVal -like "*తరచుగా*" -or $networkVal -like "*कभी-कभी*" -or $networkVal -like "*अक्सर*") {
        $poorNetwork++
    }
    
    # Trust
    if ($trustVal -like "*Yes*" -or $trustVal -like "*అవును*" -or $trustVal -like "*हाँ*") {
        $trustYes++
    } elseif ($trustVal -like "*Maybe*" -or $trustVal -like "*కావచ్చు*" -or $trustVal -like "*शायद*") {
        $trustMaybe++
    }
    
    # Challenges split
    if ($challengesVal) {
        $parts = $challengesVal -split ","
        foreach ($part in $parts) {
            $trimmed = $part.Trim().ToLower()
            if ($trimmed) {
                $challenges[$trimmed] = [int]$challenges[$trimmed] + 1
            }
        }
    }
    
    # Features split
    if ($featuresVal) {
        $parts = $featuresVal -split ","
        foreach ($part in $parts) {
            $trimmed = $part.Trim().ToLower()
            if ($trimmed) {
                $features[$trimmed] = [int]$features[$trimmed] + 1
            }
        }
    }
}

Write-Output "Total Responses: $total"
$witnessedPct = ($witnessedYes / $total) * 100
Write-Output "Witnessed accident: $witnessedYes ($([math]::Round($witnessedPct, 1))%)"

$networkPct = ($poorNetwork / $total) * 100
Write-Output "Experienced poor mobile network: $poorNetwork ($([math]::Round($networkPct, 1))%)"

$trustYesPct = ($trustYes / $total) * 100
$trustMaybePct = ($trustMaybe / $total) * 100
$trustTotalPct = (($trustYes + $trustMaybe) / $total) * 100
Write-Output "Trust Auto System Yes: $trustYes ($([math]::Round($trustYesPct, 1))%)"
Write-Output "Trust Auto System Maybe: $trustMaybe ($([math]::Round($trustMaybePct, 1))%)"
Write-Output "Trust (Yes + Maybe): $($trustYes + $trustMaybe) ($([math]::Round($trustTotalPct, 1))%)"

Write-Output "`nTop Challenges:"
$challenges.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 5 | ForEach-Object {
    $pct = ($_.Value / $total) * 100
    Write-Output "  $($_.Key): $($_.Value) ($([math]::Round($pct, 1))%)"
}

Write-Output "`nTop Features Requested:"
$features.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 5 | ForEach-Object {
    $pct = ($_.Value / $total) * 100
    Write-Output "  $($_.Key): $($_.Value) ($([math]::Round($pct, 1))%)"
}
