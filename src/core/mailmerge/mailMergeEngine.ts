import Papa from 'papaparse';
import { MailMergeRecord } from '../../types/document';

export interface ParseCsvResult {
  fields: string[];
  records: MailMergeRecord[];
  error?: string;
}

export function parseCsvRecipients(csvContent: string): ParseCsvResult {
  const result = Papa.parse<Record<string, string>>(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });

  if (result.errors && result.errors.length > 0 && result.data.length === 0) {
    return {
      fields: [],
      records: [],
      error: result.errors[0].message,
    };
  }

  const fields = result.meta.fields || [];
  const records = result.data.map((row) => {
    const cleanRow: MailMergeRecord = {};
    fields.forEach((field) => {
      cleanRow[field] = (row[field] || '').trim();
    });
    return cleanRow;
  });

  return { fields, records };
}

/**
 * Replaces merge field placeholders like <<Field>>, &laquo;Field&raquo;, «Field», or {{Field}} with record values.
 */
export function substituteMergeFields(htmlTemplate: string, record: MailMergeRecord): string {
  let output = htmlTemplate;

  // Replace <<Field>>, &lt;&lt;Field&gt;&gt;, &laquo;Field&raquo;, «Field»
  output = output.replace(
    /(?:<<|&lt;&lt;|&laquo;|«)([\w\s_]+)(?:>>|&gt;&gt;|&raquo;|»)/g,
    (match, fieldName) => {
      const key = fieldName.trim();
      if (record[key] !== undefined) {
        return record[key];
      }
      return match;
    }
  );

  // Replace {{Field}}
  output = output.replace(/\{\{([\w\s_]+)\}\}/g, (match, fieldName) => {
    const key = fieldName.trim();
    if (record[key] !== undefined) {
      return record[key];
    }
    return match;
  });

  return output;
}

/**
 * Generates an aggregated batch HTML containing all merged records separated by page breaks.
 */
export function generateMergedBatch(htmlTemplate: string, records: MailMergeRecord[]): string {
  return records
    .map((record, index) => {
      const mergedHtml = substituteMergeFields(htmlTemplate, record);
      const isLast = index === records.length - 1;
      return `<div class="merge-record-wrapper" data-record-index="${index}">${mergedHtml}</div>${
        isLast ? '' : '<div class="page-break" data-page-break="true"><hr style="break-after:page;"></div>'
      }`;
    })
    .join('');
}
