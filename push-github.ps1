# Script para fazer push para GitHub
$repoPath = "C:\Users\arauj\Documents\CURSOS E PROJETOS\GitHub\segundo-cerebro"
$githubUrl = "https://github.com/araujobazilio/Dashboard_Jarvis.git"

Set-Location $repoPath

# Remover .git se existir
if (Test-Path ".git") {
    Write-Host "Removendo .git antigo..."
    cmd /c "rmdir /s /q .git"
}

# Inicializar novo repositório
Write-Host "Inicializando repositório Git..."
git init
git config user.email "rafael.araujo.bazilio@gmail.com"
git config user.name "Rafael Araujo Bazilio"

# Adicionar arquivos
Write-Host "Adicionando arquivos..."
git add .

# Fazer commit
Write-Host "Fazendo commit..."
git commit -m "Initial commit: Segundo Cerebro Dashboard - PKM System"

# Adicionar remote
Write-Host "Adicionando remote GitHub..."
git remote add origin $githubUrl

# Fazer push
Write-Host "Fazendo push para GitHub..."
git branch -M main
git push -u origin main

Write-Host "Push concluído com sucesso!"
