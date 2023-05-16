import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import json from "@rollup/plugin-json";
import vue from "rollup-plugin-vue";
import postcss from "rollup-plugin-postcss";
import { readFileSync } from "fs";

const pkg = JSON.parse(readFileSync("./package.json", "utf8"));

export default [
  {
    input: "./core/index.ts",
    output: [
      {
        file: pkg.main,
        format: "cjs",
      },
      {
        file: pkg.module,
        format: "es",
      },
      {
        file: pkg.browser,
        name: pkg.name,
        format: "umd",
      },
    ],
    plugins: [
      resolve(),
      vue(),
      postcss(),
      typescript(),
      commonjs(),
      json(),
    ],
  },
];
