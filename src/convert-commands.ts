import fs from "fs";
import {
  CSCommandParameter,
  CSNumberParameter,
  CSRawCommandConfig,
} from "./types";

function convertSchema1ToCSRawCommandConfig(
  input: Array<any>
): CSRawCommandConfig {
  const res = input.map((command) => ({
    name: command?.name,
    label: command?.label,
    parameters: Array.isArray(command.parameters)
      ? command.parameters.map(convertParameter)
      : convertParameter(command.parameters),
    metadata: {
      category: command?.category,
      description: command.metadata?.description,
      sv_cheats: command.metadata?.sv_cheats ?? false,
      tooltip: command.metadata?.tooltip,
    },
  }));
  return { commands: res };
}

function convertParameter(param: any): CSCommandParameter | undefined {
  const number = () =>
    ({
      type: "number",
      value: {
        min: param.value.min,
        max: param.value.max,
        step: param.value.step,
        def: param.value.def,
      },
    } as CSNumberParameter);
  switch (param.type) {
    case "int":
      return number();
    case "float":
      return number();
    case "enum":
      return {
        type: "enum",
        value: {
          options: param.value.options?.map((opt: any) => ({
            value: opt.value,
            label: opt.label,
          })),
          def: param.value.def,
        },
      };
    case "bool":
      return {
        type: "bool",
        value: {
          def: param.value.def,
        },
      };
    case "string":
      return {
        type: "string",
        value: param.value,
      };
    case "table":
      // console.log("table", param.value);
      if (param.value?.table_name) return { type: "table", value: param.value };

      return {
        type: "table",
        value: {
          columns: param.value.columns?.map((col: any) => ({
            label: col.label,
            key: col.key,
            type: col.type,
          })),
          rows: param.value.rows,
          def: param.value.def,
        },
      };
    default:
      console.log("Unsupported parameter type:", param.type);
    // throw new Error(`Unsupported parameter type: ${param.type}`);
  }
}

// Example usage
const rawJson = fs.readFileSync(
  "/home/shrt/github/cs-commands/src/commands.json",
  "utf-8"
);

const schema1Data = JSON.parse(rawJson);
const convertedData = convertSchema1ToCSRawCommandConfig(schema1Data);
fs.writeFileSync(
  "converted-commands.json",
  JSON.stringify(convertedData, null, 2)
);
console.log("Commands File Converted!");
