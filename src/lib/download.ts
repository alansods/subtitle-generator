// Entrega um arquivo gerado no navegador para o usuário baixar (nada passa por servidor).
export function downloadBlob(fileName: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.style.display = 'none';
  document.body.append(link);
  link.click();
  link.remove();
  // Revoga depois que o navegador começou o download.
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

export function downloadText(fileName: string, content: string, mimeType: string): void {
  downloadBlob(fileName, new Blob([content], { type: `${mimeType};charset=utf-8` }));
}
