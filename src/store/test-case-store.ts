import { create } from "zustand";
import { persist } from "zustand/middleware";
import { z } from "zod";
import { customValueSchema } from "@/lib/zodSchema";

// Define the shape of our test cases
export interface TestCase {
	name: string;
	value: string | number;
	type: string;
}

interface TestCaseState {
	predefinedTestCases: TestCase[];
	customTestCases: TestCase[];
	addTestCase: (data: z.infer<typeof customValueSchema>) => void;
	editTestCase: (
		data: z.infer<typeof customValueSchema>,
		index: number
	) => void;
	deleteTestCase: (index: number) => void;
}
const initialPredefinedValues: TestCase[] = [
	{ name: "Empty String", value: "", type: "String" },
	{ name: "Null", value: "null", type: "String" },
	{ name: "length", value: "define length for validation", type: "String" },
	{ name: "Numeric String", value: "12345", type: "String" },
	{ name: "Alphanumeric Mix", value: "12345abc", type: "String" },
	{ name: "Only Space", value: " ", type: "String" },
	{ name: "Special Character", value: "@#&*!", type: "String" },

	{ name: "Valid Date Format", value: "2023-01-01T10:00:00Z", type: "Date" },
	{ name: "Invalid Date Format", value: "22/04/202aaa", type: "Date" },
	{ name: "Past Date", value: "1900-01-01", type: "Date" },
	{ name: "Future Date", value: "2050-01-01", type: "Date" },
	{ name: "Invalid Calendar Date", value: "2023-02-30", type: "Date" },
	{ name: "Invalid Month Date", value: "2023-13-01", type: "Date" },

	{ name: "Incorrect File Type", value: ".exe", type: "File" },
	{ name: "Image File", value: ".jpg", type: "File" },
	{ name: "Video File", value: ".mp4", type: "File" },
	{ name: "Empty File", value: "0 byte file", type: "File" },
	{ name: "MaxSize (single file)", value: "5Mb (limit 5Mb)", type: "File" },
	{ name: "MaxSize (multiple file)", value: "25Mb (limit 5Mb)", type: "File" },

	{ name: "Positive Number", value: 5, type: "Number" },
	{ name: "Large Positive Number", value: 1000, type: "Number" },
	{ name: "Null", value: "null", type: "Number" },
	{ name: "Float Number", value: 1.23, type: "Number" },
	{ name: "Negative Number", value: -1, type: "Number" },
	{ name: "Zero", value: 0, type: "Number" },
	{ name: "Max boundary", value: "max", type: "Number" },
	{ name: "Min boundary", value: "min", type: "Number" },
	{ name: "String number", value: "12", type: "Number" },
	{ name: "High Precision Float", value: 0.12345678912345, type: "Number" },

	{ name: "Null", value: "null", type: "Boolean" },
	{ name: "True", value: "true", type: "Boolean" },
	{ name: "False", value: "false", type: "Boolean" },
	{ name: "Boolean as Integer (1)", value: 1, type: "Boolean" },
	{ name: "Boolean as Integer (0)", value: 0, type: "Boolean" },
	{ name: "Boolean as String (true)", value: "true", type: "Boolean" },
	{ name: "Boolean as String (false)", value: "false", type: "Boolean" },

	{
		name: "Valid UUID",
		value: "550e8400-e29b-41d4-a716-446655440000",
		type: "UUID",
	},
	{ name: "Invalid UUID", value: "550e8400-e29b-41d4-a716", type: "UUID" },

	{ name: "Valid Enum Value", value: "active", type: "ENUM" },
	{ name: "Invalid Enum Value", value: "deleted", type: "ENUM" },

	{ name: "Empty Array", value: "[]", type: "Array" },
	{ name: "Non-Empty Integer Array", value: "[1]", type: "Array" },
	{ name: "Non-Empty String Array", value: "['1']", type: "Array" },
	{ name: "Non-Empty Boolean Array", value: "[true,false]", type: "Array" },
	{
		name: "Mixed Data Type Array",
		value: "[1, 'string', true]",
		type: "Array",
	},
	{ name: "Nested Arrays", value: "[[1,2], [3,4]]", type: "Array" },
	{ name: "Duplicate Elements", value: "[1, 2, 2]", type: "Array" },
	{
		name: "Array with Null Element (Number)",
		value: "[1, null]",
		type: "Array",
	},
	{
		name: "Array with Null Element (String)",
		value: "['1', null]",
		type: "Array",
	},
	{
		name: "Array with Null Element (Boolean)",
		value: "[true, null]",
		type: "Array",
	},
];

const defaultCustomCases: TestCase[] = [
	{ name: "Email - Invalid Format", value: "user@invalid", type: "String" },
	{ name: "Email - SQL Injection", value: "' OR 1=1; --", type: "String" },
	{ name: "Password - Weak Password", value: "123456", type: "String" },
	{ name: "Password - Empty", value: "", type: "String" },
	{
		name: "Username - Too Long",
		value: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa....",
		type: "String",
	},
	{ name: "Username - Only Space", value: " ", type: "String" },
	// { name: "Age - Negative Value", value: -1, type: "Number" },
	{ name: "Age - Type Mismatch (String)", value: "twenty", type: "Number" },
];

const useTestCaseStore = create<TestCaseState>()(
	persist(
		(set) => ({
			// STATE
			predefinedTestCases: initialPredefinedValues,
			// --- THIS IS THE FIX ---
			// Explicitly cast the empty array to TestCase[] to resolve the type error.
			customTestCases: defaultCustomCases,

			// ACTIONS (These now ONLY modify the customTestCases array)
			addTestCase: (data) =>
				set((state) => ({
					customTestCases: [
						...state.customTestCases,
						{ name: data.nameCase, value: data.value, type: data.typeCase },
					],
				})),

			editTestCase: (data, index) =>
				set((state) => ({
					customTestCases: state.customTestCases.map((item, i) =>
						i === index
							? { name: data.nameCase, value: data.value, type: data.typeCase }
							: item
					),
				})),

			deleteTestCase: (index) =>
				set((state) => ({
					customTestCases: state.customTestCases.filter((_, i) => i !== index),
				})),
		}),
		{
			name: "customTestCasesStorage", // The localStorage key
			// We only want to persist the customTestCases array.
			partialize: (state) => ({ customTestCases: state.customTestCases }),
		}
	)
);

export default useTestCaseStore;
