import { parse } from 'csv-parse/sync';

export async function handleCSV(file: File): Promise<string> {
    console.log(file)
  const fileContent = await file.text();
  const parsedData = parse(fileContent, {columns: true, skip_empty_lines: true, relaxColumnCount: true});
  return `File Content Summary:
    Number of rows: ${parsedData.length}
    ${Array.isArray(parsedData[0]) ? `First few rows: ${JSON.stringify(parsedData.slice(0, 15), null, 2)}` : 
      `Columns: ${Object.keys(parsedData[0]).join(', ')}\nFirst few rows: ${JSON.stringify(parsedData.slice(0, 15), null, 2)}`}
  `;
}