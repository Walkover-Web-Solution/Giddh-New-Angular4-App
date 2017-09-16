import * as jsPDF from 'jspdf';

interface JsPDFAutoTable extends jsPDF {
  autoTable(row: any, column: any, options?: any);

  autoTableEndPosY();
}
