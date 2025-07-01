"use client"

import { useEffect, useState } from "react"
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { CustomCheckbox } from "./custom-checkbox"
import {
  getAllProjectVariableAction,
  deleteVariableByIdAction,
  createVariableAction,
  updateProjectVariableAction,
  toggleAllProjectVariablesAction,
} from "@/action/project-variable-action"

interface ProjectVariableProps {
  projectId: string
  token: string
}

interface VariableRow {
  variableId?: string
  variable: string
  value: string
  enabled: boolean
}

export default function ProjectVariable({ projectId, token }: ProjectVariableProps) {
  const [rows, setRows] = useState<VariableRow[]>([])
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [originalRow, setOriginalRow] = useState<VariableRow | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadVariables()
  }, [projectId])

  const loadVariables = async () => {
    try {
      const variables = await getAllProjectVariableAction(projectId, token)
      setRows(variables)
      setError(null)
    } catch (err) {
      setError("Failed to load variables. Please try again.")
    }
  }

  const handleAddRow = () => {
    setRows([...rows, { variable: "", value: "", enabled: true }])
  }

  const handleChange = (index: number, field: keyof VariableRow, value: string | boolean) => {
    const updatedRows = [...rows]
    updatedRows[index][field] = value as never
    setRows(updatedRows)
  }

  const handleToggleEnabled = async (index: number) => {
    const row = rows[index]
    const newEnabled = !row.enabled

    if (!row.variableId) {
      handleChange(index, "enabled", newEnabled)
      return
    }

    setIsSaving(true)
    try {
      await updateProjectVariableAction(
        row.variableId,
        {
          keyName: row.variable,
          keyValue: row.value,
          enabled: newEnabled,
          projectId
        },
        token
      )
      handleChange(index, "enabled", newEnabled)
    } catch (err) {
      setError("Failed to update variable status")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveRow = async (index: number) => {
    const row = rows[index]
    
    // Validate inputs
    if (!row.variable?.trim()) {
      setError("Variable name is required")
      return false
    }
    if (!row.value?.trim()) {
      setError("Variable value is required")
      return false
    }

    setIsSaving(true)
    try {
      if (row.variableId) {
        const updatedVariable = await updateProjectVariableAction(
          row.variableId,
          {
            keyName: row.variable,
            keyValue: row.value,
            enabled: row.enabled,
            projectId
          },
          token
        )
        
        // Update the row with the returned data
        const updatedRows = [...rows]
        updatedRows[index] = {
          variableId: updatedVariable.variableId,
          variable: updatedVariable.variable,
          value: updatedVariable.value,
          enabled: updatedVariable.enabled
        }
        setRows(updatedRows)
      } else {
        const result = await createVariableAction(
          {
            name: row.variable,
            value: row.value,
            enabled: row.enabled,
            projectId
          },
          token
        )
        
        const updatedRows = [...rows]
        updatedRows[index] = {
          variableId: result.variableId,
          variable: result.variable,
          value: result.value,
          enabled: result.enabled
        }
        setRows(updatedRows)
      }
      setError(null)
      return true
    } catch (err) {
      console.error("Save operation failed:", err)
      setError(`Failed to ${row.variableId ? "update" : "create"} variable: ${err instanceof Error ? err.message : 'Unknown error'}`)
      return false
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteRow = async () => {
    if (deleteIndex === null) return
    const row = rows[deleteIndex]

    setIsSaving(true)
    try {
      if (row.variableId) {
        await deleteVariableByIdAction(row.variableId, token)
      }
      setRows(rows.filter((_, i) => i !== deleteIndex))
      setDeleteIndex(null)
    } catch (err) {
      setError("Failed to delete variable")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCellFocus = (index: number) => {
    setOriginalRow({ ...rows[index] })
    setEditIndex(index)
  }

  const handleCellBlur = async (index: number) => {
    const row = rows[index]
    
    // Don't save if the row is empty (newly added)
    if (!row.variableId && !row.variable.trim() && !row.value.trim()) {
      return
    }

    // For new rows with content, try to save immediately
    if (!row.variableId && (row.variable.trim() || row.value.trim())) {
      if (!row.variable.trim()) {
        setError("Variable name is required")
        return
      }
      if (!row.value.trim()) {
        setError("Variable value is required")
        return
      }
      await handleSaveRow(index)
      return
    }

    // For existing rows, check if changes were made
    if (originalRow && (row.variable !== originalRow.variable || row.value !== originalRow.value)) {
      setShowEditDialog(true)
    } else {
      setEditIndex(null)
      setOriginalRow(null)
    }
  }

  const handleSaveChanges = async () => {
    if (editIndex === null) {
      setShowEditDialog(false)
      return
    }

    try {
      const success = await handleSaveRow(editIndex)
      if (success) {
        setEditIndex(null)
        setOriginalRow(null)
      }
    } finally {
      setShowEditDialog(false)
    }
  }

  const handleCancelChanges = () => {
    if (editIndex === null || !originalRow) {
      setShowEditDialog(false)
      return
    }

    const updatedRows = [...rows]
    updatedRows[editIndex] = { ...originalRow }
    setRows(updatedRows)
    setEditIndex(null)
    setOriginalRow(null)
    setShowEditDialog(false)
    setError(null)
  }

  const handleToggleAll = async (enabled: boolean) => {
    setIsSaving(true)
    try {
      await toggleAllProjectVariablesAction(projectId, enabled, token)
      setRows(rows.map(row => ({ ...row, enabled })))
    } catch (err) {
      setError("Failed to toggle all variables")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Project Variables</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleToggleAll(true)} disabled={isSaving}>
            Enable All
          </Button>
          <Button variant="outline" onClick={() => handleToggleAll(false)} disabled={isSaving}>
            Disable All
          </Button>
          <Button onClick={handleAddRow} disabled={isSaving}>
            Add Variable
          </Button>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {isSaving && <p className="text-blue-500 text-sm">Saving...</p>}

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-center">Enabled</TableHead>
              <TableHead className="border-r">Variable</TableHead>
              <TableHead className="border-r">Value</TableHead>
              <TableHead className="w-20 text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={row.variableId || `new-${index}`}>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <CustomCheckbox
                      checked={row.enabled}
                      onCheckedChange={() => handleToggleEnabled(index)}
                      disabled={isSaving}
                    />
                  </div>
                </TableCell>
                <TableCell className="border-r">
                  <input
                    type="text"
                    value={row.variable}
                    onFocus={() => handleCellFocus(index)}
                    onBlur={() => handleCellBlur(index)}
                    onChange={(e) => handleChange(index, "variable", e.target.value)}
                    className={`w-full px-2 py-1 text-sm border border-transparent focus:outline-none focus:border-gray-300 rounded ${
                      !row.enabled ? "text-gray-400 bg-gray-50" : ""
                    }`}
                    placeholder="Variable name"
                    disabled={isSaving}
                  />
                </TableCell>
                <TableCell className="border-r">
                  <input
                    type="text"
                    value={row.value}
                    onFocus={() => handleCellFocus(index)}
                    onBlur={() => handleCellBlur(index)}
                    onChange={(e) => handleChange(index, "value", e.target.value)}
                    className={`w-full px-2 py-1 text-sm border border-transparent focus:outline-none focus:border-gray-300 rounded ${
                      !row.enabled ? "text-gray-400 bg-gray-50" : ""
                    }`}
                    placeholder="Variable value"
                    disabled={isSaving}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteIndex(index)}
                        className="p-1 hover:bg-red-50"
                        disabled={isSaving}
                      >
                        <Trash2 className="text-red-500 w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete variable?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the "{row.variable}" variable.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDeleteRow}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You've made changes to this variable. Would you like to save them?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelChanges}>
              Discard
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveChanges}>
              Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}