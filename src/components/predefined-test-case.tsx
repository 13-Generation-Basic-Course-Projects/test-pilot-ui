'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
interface TestCase {
  name: string
  value: string | number
  type: string
}
const predefinedValues: TestCase[] = [
  { name: 'Undefined', value: 'undefined', type: 'String' },
  { name: 'Null', value: 'null', type: 'String' },
  { name: 'Boolean', value: 'true/false', type: 'Boolean' },
  { name: 'Invalid date format', value: '22/04/202aaa', type: 'Date' },
  { name: 'Special Character', value: '&*@&*$%', type: 'String' },
  { name: 'MaxSize (single file)', value: '5Mb (limit 5Mb)', type: 'File' },
  { name: 'Negative', value: '-1', type: 'Number' },
  { name: 'Enum', value: 'ENUM', type: 'ENUM' },
]
const filterTypes: string[] = ['String', 'Date', 'Integer', 'Array', 'File', 'UUID', 'ENUM']
export default function PredefinedTestCase() {
  const [selectedType, setSelectedType] = useState<string>('')
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)
  const filteredValues = selectedType
    ? predefinedValues.filter((item) => item.type === selectedType)
    : predefinedValues

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-end">
        <div className="relative w-64 text-sm">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full border px-4 py-2 rounded-md shadow-sm bg-white text-left text-gray-700 flex items-center justify-between"
          >
            <span>{selectedType || 'Select to filter'}</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
          {dropdownOpen && (
            <ul className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-40 overflow-y-auto">
              <li
                onClick={() => {
                  setSelectedType('')
                  setDropdownOpen(false)
                }}
                className="px-4 py-2 border border-gray-200 hover:bg-gray-100 cursor-pointer font-semibold"
              >
                Predefined Case
              </li>
              {filterTypes.map((type, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setSelectedType(type)
                    setDropdownOpen(false)
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {type}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-300 rounded-md shadow-sm">
        <table className="w-full text-left table-auto border-collapse">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th className="px-4 py-2 font-medium border-r border-gray-300">Name</th>
              <th className="px-4 py-2 font-medium border-r border-gray-300">Value</th>
              <th className="px-4 py-2 font-medium">Type</th>
            </tr>
          </thead>
          <tbody>
            {filteredValues.map((item) => (
              <tr key={item.name} className="border-t border-gray-300">
                <td className="px-4 py-2 border-r border-gray-300">{item.name}</td>
                <td className="px-4 py-2 border-r border-gray-300">{item.value}</td>
                <td className="px-4 py-2">
                  <span className="border border-gray-200 text-center text-blue-600 px-2 py-1 rounded-sm text-sm">
                    {item.type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
