import { DocumentState } from '../../types/document';

export async function exportToPdf(state: DocumentState): Promise<void> {
  // If running inside Electron, invoke the native printToPDF channel
  if ((window as any).electronAPI?.printToPdf) {
    try {
      const result = await (window as any).electronAPI.printToPdf({
        title: state.metadata.title,
        margins: state.pageSetup.margins,
        pageSize: state.pageSetup.paperSize,
        orientation: state.pageSetup.orientation,
      });
      if (result.success) {
        return;
      }
    } catch (e) {
      console.warn('Electron printToPdf failed, falling back to window.print()', e);
    }
  }

  // Fallback: standard native browser print dialog (which has Save as PDF on macOS)
  window.print();
}
