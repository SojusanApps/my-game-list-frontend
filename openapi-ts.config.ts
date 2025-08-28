import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "openapi.json",
  output: "src/client",
  plugins: [
    {
      name: "@hey-api/sdk",
      classStructure: "off",
      classNameBuilder(name) {
        return `${name}Service`;
      },
      asClass: true,
    },
    {
      name: "@hey-api/client-fetch",
    },
    {
      name: "@hey-api/typescript",
      enums: "typescript",
    },
  ],
});
