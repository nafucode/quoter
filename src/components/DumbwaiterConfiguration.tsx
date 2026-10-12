import { dumbwaiterConfigurationRows, dumbwaiterConfigurationTitle } from '@/data/dumbwaiterConfiguration';

export default function DumbwaiterConfiguration({ parts, functions }: { parts: boolean; functions: boolean }) {
  const rows = dumbwaiterConfigurationRows(parts, functions);
  if (!rows.length) return null;
  return <section className="mt-6 pt-4 border-t break-before-page">
    <h3 className="text-lg font-semibold mb-3">{dumbwaiterConfigurationTitle}</h3>
    <table className="w-full text-sm border-collapse printable-table">
      <thead className="bg-gray-200"><tr>
        {['No.', 'Component / Function', 'Specification / Description'].map(label =>
          <th key={label} className="p-2 border border-gray-400 text-left">{label}</th>)}
      </tr></thead>
      <tbody>{rows.map((row, index) => <FragmentRow key={`${row.section}-${row.number}`} row={row} section={index === 0 || rows[index - 1].section !== row.section} />)}</tbody>
    </table>
  </section>;
}

function FragmentRow({ row, section }: { row: ReturnType<typeof dumbwaiterConfigurationRows>[number]; section: boolean }) {
  return <>
    {section && <tr className="bg-gray-100"><td colSpan={3} className="p-2 border border-gray-400 font-semibold">{row.section}</td></tr>}
    <tr className="break-inside-avoid">
      <td className="p-2 border border-gray-400 align-top">{row.number}</td>
      <td className="p-2 border border-gray-400 align-top w-1/4">{row.name}</td>
      <td className="p-2 border border-gray-400 whitespace-pre-line">{row.details}</td>
    </tr>
  </>;
}
