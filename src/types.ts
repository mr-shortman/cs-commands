export type CSNumberParameter = {
  type: "number";
  value: { min: number; max: number; step?: number; def: number };
};

export type CSEnumParameter = {
  type: "enum";
  value: { options: { value: string; label: string }[]; def: string };
};
export type CSBoolParameter = {
  type: "bool";
  value: { def: boolean };
};

export type CSStringParameter = {
  type: "string";
  value: { value: string };
};

export type CSTableParameterValue =
  | {
      columns: Array<{
        label: string; // User-friendly column name
        key: string; // Unique identifier for each column
        type: "string" | "number" | "bool"; // Type of data in the column
      }>;
      rows: Array<Record<string, string | number | boolean>>; // Each row is an object with column keys
      def: Array<Record<string, string | number | boolean>>; // Default values for the table
    }
  | {
      table_name: string;
      is_multiple_items: boolean;
    };

export type CSTableParameter = {
  type: "table";
  value: CSTableParameterValue;
};
export type CSCommandParameter =
  | CSNumberParameter
  | CSEnumParameter
  | CSBoolParameter
  | CSStringParameter
  | CSTableParameter;

export type CSCommand = {
  name: string;
  label: string;
  parameters: CSCommandParameter[];
  metadata: {
    category: string;
    description?: string;
    sv_cheats: boolean;
    tooltip?: string;
  };
};

export type RawCommand = Omit<CSCommand, "metadata"> & {
  metadata?: Partial<CSCommand["metadata"]>;
};

export type CSRawCommandConfig = { commands: Array<RawCommand> };

export type CSCommandConfig = Array<CSCommand>;
