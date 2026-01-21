import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "openapi.json",
  output: "src/client",
  plugins: [
    {
      name: "@hey-api/sdk",
      operations: {
        containerName: "{{name}}Service",
        strategy: "byTags",
      },
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
